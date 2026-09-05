import { describe, expect, test } from 'vitest';
import path from 'path';
import remarkDirective from 'remark-directive';
import Docfy from '@docfy/core';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/code-tabs');
const escapingRoot = path.resolve(import.meta.dirname, './__fixtures__/code-tabs-escaping');

async function renderFixture(fixtureRoot: string = root) {
  const docfy = new Docfy({
    plugins: [codeBlocks],
    remarkPlugins: [remarkDirective],
  });
  const result = await docfy.run([
    { root: fixtureRoot, urlPrefix: 'docs', pattern: '**/*.md' },
  ]);
  return result.content[0]!;
}

describe(':::code-tabs directive', () => {
  test('emits a single DocfyCodeTabs wrapper', async () => {
    const page = await renderFixture();

    expect(page.rendered.match(/<DocfyCodeTabs as \|tabs\|>/g)).toHaveLength(1);
    expect(page.rendered.match(/<\/DocfyCodeTabs>/g)).toHaveLength(1);
  });

  test('labels each tab from the fence title, falling back to the language', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('<tabs.Tab @label="pnpm">');
    expect(page.rendered).toContain('<tabs.Tab @label="npm">');
    expect(page.rendered).toContain('<tabs.Tab @label="js">');
  });

  test('still wraps each fence inside the group in a DocfyCodeBlock', async () => {
    const page = await renderFixture();

    expect(page.rendered.match(/<DocfyCodeBlock/g)).toHaveLength(3);
  });

  test('registers both component imports', async () => {
    const page = await renderFixture();
    const imports = (page.pluginData as { imports?: { name: string }[] }).imports ?? [];
    const names = imports.map(i => i.name);

    expect(names).toContain('DocfyCodeBlock');
    expect(names).toContain('DocfyCodeTabs');
  });

  test('a single-quoted title containing a double quote does not break out of the tab label attribute', async () => {
    const page = await renderFixture(escapingRoot);

    // The label is interpolated into `<tabs.Tab @label="...">` inside a raw
    // mdast html node, invisible to the hast-stage `escapeCurliesInCode` pass,
    // so it must be escaped the same way `openingTag()` escapes `@title`.
    expect(page.rendered).toContain('<tabs.Tab @label="say &quot;hi&quot;">');
  });

  test('a title containing curlies is escaped so it does not reach the template as a mustache', async () => {
    const page = await renderFixture(escapingRoot);

    expect(page.rendered).toContain('<tabs.Tab @label="not a \\{{mustache}}">');
  });
});
