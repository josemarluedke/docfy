import { describe, expect, test } from 'vitest';
import path from 'path';
import remarkDirective from 'remark-directive';
import Docfy from '@docfy/core';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/code-tabs');
const escapingRoot = path.resolve(import.meta.dirname, './__fixtures__/code-tabs-escaping');
const preambleRoot = path.resolve(import.meta.dirname, './__fixtures__/code-tabs-preamble');
const emptyRoot = path.resolve(import.meta.dirname, './__fixtures__/code-tabs-empty');

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

    // 3 fences inside the tab group, plus the standalone fence outside it.
    expect(page.rendered.match(/<DocfyCodeBlock/g)).toHaveLength(4);
  });

  test('a fence inside a tab group emits its label on the tab but no @title on the block', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('<tabs.Tab @label="pnpm">');

    // The block for the "pnpm" tab must not also carry `@title="pnpm"` — the
    // tab label already shows it, and repeating it would draw a second,
    // redundant title bar under the tab.
    const pnpmTabIndex = page.rendered.indexOf('<tabs.Tab @label="pnpm">');
    const pnpmTabEnd = page.rendered.indexOf('</tabs.Tab>', pnpmTabIndex);
    const pnpmBlockSlice = page.rendered.slice(pnpmTabIndex, pnpmTabEnd);

    expect(pnpmBlockSlice).toContain('<DocfyCodeBlock');
    expect(pnpmBlockSlice).not.toContain('@title=');
  });

  test('a fence outside a tab group still gets its @title', async () => {
    const page = await renderFixture();

    const wrapperStart = page.rendered.indexOf('<DocfyCodeTabs as |tabs|>');
    const standaloneSlice = page.rendered.slice(0, wrapperStart);

    expect(standaloneSlice).toContain('<DocfyCodeBlock');
    expect(standaloneSlice).toContain('@title="standalone"');
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
    expect(page.rendered).not.toContain('<tabs.Tab @label="say "hi"">');
  });

  test('a title containing curlies is escaped so it does not reach the template as a mustache', async () => {
    const page = await renderFixture(escapingRoot);

    expect(page.rendered).toContain('<tabs.Tab @label="not a \\{{mustache}}">');
    expect(page.rendered).not.toMatch(
      /<tabs\.Tab @label="not a (?<!\\)\{\{mustache\}\}">/
    );
  });

  test('non-fence content between fences is hoisted out as preamble before the wrapper, not left stranded inside it', async () => {
    const page = await renderFixture(preambleRoot);

    expect(page.rendered).toContain('Some in-between paragraph content.');

    const wrapperStart = page.rendered.indexOf('<DocfyCodeTabs as |tabs|>');
    const wrapperEnd = page.rendered.indexOf('</DocfyCodeTabs>');
    const preambleIndex = page.rendered.indexOf('Some in-between paragraph content.');

    // The paragraph belongs to no tab, so it must render exactly once, before
    // the wrapper opens — never inside it, where it would render regardless
    // of which tab is active.
    expect(preambleIndex).toBeGreaterThan(-1);
    expect(preambleIndex).toBeLessThan(wrapperStart);
    expect(preambleIndex).not.toBeGreaterThan(wrapperEnd);
  });

  test('non-fence content before the first fence and after the last fence is also hoisted out as preamble', async () => {
    const page = await renderFixture(preambleRoot);

    const wrapperStart = page.rendered.indexOf('<DocfyCodeTabs as |tabs|>');
    const wrapperEnd = page.rendered.indexOf('</DocfyCodeTabs>');

    const leadingIndex = page.rendered.indexOf(
      'Some leading paragraph content, before any fence.'
    );
    const trailingIndex = page.rendered.indexOf(
      'Some trailing paragraph content, after the last fence.'
    );

    // Both the paragraph that precedes the first fence and the one that
    // follows the last fence belong to no single tab, exactly like content
    // sandwiched between two fences — the partition treats "before the
    // first fence" and "after the last fence" as just more non-fence
    // children, not special cases, so both must be hoisted out before the
    // wrapper opens rather than rendered inside any tab or after
    // </DocfyCodeTabs>.
    expect(leadingIndex).toBeGreaterThan(-1);
    expect(leadingIndex).toBeLessThan(wrapperStart);
    expect(leadingIndex).not.toBeGreaterThan(wrapperEnd);

    expect(trailingIndex).toBeGreaterThan(-1);
    expect(trailingIndex).toBeLessThan(wrapperStart);
    expect(trailingIndex).not.toBeGreaterThan(wrapperEnd);
  });

  test('a code-tabs directive with no fences emits no wrapper at all', async () => {
    const page = await renderFixture(emptyRoot);

    expect(page.rendered).not.toContain('DocfyCodeTabs');
    expect(page.rendered).toContain('Just a paragraph, no fences at all.');
  });
});
