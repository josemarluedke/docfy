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

  test('resolves the glimmer aliases rather than falling back to plain text', async () => {
    const html = await render();

    // Shiki records the resolved language on the <pre>. If an alias failed to
    // resolve it would say "text" (or throw), which is exactly the silent
    // degradation this preset exists to prevent.
    expect(html).toContain('language="glimmer-ts"');
    expect(html).toContain('language="glimmer-js"');
    expect(html).toContain('language="handlebars"');
    expect(html).toContain('language="js"');
    expect(html).not.toContain('language="text"');
  });

  test('tokenises glimmer template tags inside a gts fence', async () => {
    const html = await render();

    // `<template>` is the thing highlight.js could not handle without the
    // hand-written glimmerTypescript wrapper this preset replaces.
    expect(html).toContain('&#x3C;template>');
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
