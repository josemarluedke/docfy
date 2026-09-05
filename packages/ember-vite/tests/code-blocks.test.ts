import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';
import escapeCurliesInCode from '../src/docfy-plugins/escape-curlies-in-code.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/code-blocks');

async function renderFixture(plugins = [codeBlocks]) {
  const docfy = new Docfy({ plugins });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!;
}

describe('code-blocks plugin', () => {
  test('wraps every pre in a DocfyCodeBlock invocation', async () => {
    const page = await renderFixture();
    const opens = page.rendered.match(/<DocfyCodeBlock/g) ?? [];
    const closes = page.rendered.match(/<\/DocfyCodeBlock>/g) ?? [];

    expect(opens).toHaveLength(4);
    expect(closes).toHaveLength(4);
  });

  test('passes the parsed fence options as arguments', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('@language="gts"');
    expect(page.rendered).toContain('@title="app/components/thing.gts"');
    expect(page.rendered).toContain('@collapsible={{true}}');
    expect(page.rendered).toContain('@showLineNumbers={{true}}');
    expect(page.rendered).toContain('@copyable={{false}}');
  });

  test('omits arguments that are at their default', async () => {
    const page = await renderFixture();
    const plain = page.rendered.slice(
      page.rendered.indexOf('<DocfyCodeBlock'),
      page.rendered.indexOf('</DocfyCodeBlock>'),
    );

    expect(plain).toContain('@language="js"');
    expect(plain).not.toContain('@collapsible');
    expect(plain).not.toContain('@title');
  });

  test('registers the DocfyCodeBlock import', async () => {
    const page = await renderFixture();
    const imports = (page.pluginData as { imports?: { name: string }[] }).imports ?? [];

    expect(imports.map((i) => i.name)).toContain('DocfyCodeBlock');
  });

  test('curly escaping still applies after the rewrite', async () => {
    const page = await renderFixture([codeBlocks, escapeCurliesInCode]);

    // The hbs fence must come out escaped. If the rewrite ran after escaping,
    // or replaced the nodes escaping walks, bare `{{` would survive here and
    // Ember's template compiler would try to parse it as a mustache.
    expect(page.rendered).toContain('\\{{#if this.value}}');
    expect(page.rendered).not.toMatch(/(?<!\\)\{\{#if this\.value\}\}/);
  });

  test('the wrapper argument mustaches are NOT escaped', async () => {
    const page = await renderFixture([codeBlocks, escapeCurliesInCode]);

    // The invocation's own `{{true}}` is real template syntax and must survive
    // the escape pass intact — escaping applies inside `code`, not to the
    // wrapper this plugin emits around it.
    expect(page.rendered).toContain('@collapsible={{true}}');
  });
});
