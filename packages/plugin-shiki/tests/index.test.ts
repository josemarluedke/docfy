import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import docfyShiki from '../src/index.js';

const root = path.resolve(import.meta.dirname, './__fixtures__');

async function render(options?: Parameters<typeof docfyShiki>[0]) {
  const docfy = new Docfy({ rehypePlugins: docfyShiki(options) });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!.rendered;
}

describe('docfyShiki', () => {
  test('highlights every language the docs actually use', async () => {
    const html = await render();

    expect(html).toContain('class="shiki');
    // A real grammar tokenises `const` as a keyword; the plain-text fallback
    // would emit a single undifferentiated span.
    expect(html).toMatch(/<span style="[^"]*">const<\/span>/);
  });

  test('tokenises glimmer template tags inside a gts fence', async () => {
    const html = await render();

    // Real tokenisation splits `<template>` into separately coloured spans
    // (the opening `<`, the tag name, and the closing `>` each get their own
    // scope), whereas a plain-text fallback would emit one undifferentiated
    // run for the whole tag. This is the actual thing highlight.js could not
    // handle without a hand-written wrapper grammar, and it is Shiki's own
    // output — not something this preset computes from its own alias map.
    expect(html).toMatch(/<span style="[^"]*">template<\/span>/);
    expect(html).toMatch(/<span style="[^"]*">\{\{<\/span>/);
  });

  test('tokenises glimmer template tags inside a gjs fence', async () => {
    const html = await render();

    expect(html).toMatch(/<span style="[^"]*">template<\/span>/);
  });

  test('tokenises handlebars block helpers inside an hbs fence', async () => {
    const html = await render();

    // `{{#if ...}}` is a block-helper construct; a real Handlebars grammar
    // tokenises the `#if` helper keyword distinctly from the surrounding
    // `{{`/`}}` delimiters and from the `this.value` argument.
    expect(html).toMatch(/<span style="[^"]*">#if<\/span>/);
  });

  test('resolves the glimmer aliases rather than falling back to plain text', async () => {
    const html = await render();

    // This preset writes its own `data-language` attribute from its alias
    // map, so on its own this only proves the fence reached the transformer
    // at all (i.e. didn't fall back to plain, untouched output) — it cannot
    // prove the *right* grammar was used for it. The tokenisation
    // assertions above are the primary evidence of that; this is a
    // secondary signal.
    expect(html).toContain('data-language="glimmer-ts"');
    expect(html).toContain('data-language="glimmer-js"');
    expect(html).toContain('data-language="handlebars"');
    expect(html).toContain('data-language="js"');
  });

  test('leaves a fence in an unsupported language untouched rather than throwing', async () => {
    // The fixture includes a ```rust fence. `rust` is not in this preset's
    // curated language list, so this must not throw mid-build — it must
    // degrade to plain, unhighlighted fenced code.
    const html = await render();

    expect(html).toContain('fn main() {}');
    expect(html).not.toContain('data-language="rust"');
  });

  test('emits both themes as CSS variables', async () => {
    const html = await render();

    expect(html).toContain('--shiki-dark');
  });

  test('marks lines named in the fence meta', async () => {
    const html = await render();

    expect(html).toContain('data-highlighted');
  });

  test('accepts custom themes', async () => {
    const html = await render({ themes: { light: 'github-light', dark: 'nord' } });

    expect(html).toContain('--shiki-dark');
  });
});
