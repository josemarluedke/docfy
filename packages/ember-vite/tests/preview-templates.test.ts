import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import previewTemplates from '../src/docfy-plugins/preview-templates.js';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';
import type { DemoComponent } from '../src/types.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/preview-templates');

async function renderFixture() {
  // Same order as `loadDocfyConfig`: previewTemplates extracts the demo before
  // codeBlocks wraps whatever fences are left standing.
  const docfy = new Docfy({ plugins: [previewTemplates, codeBlocks] });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!;
}

describe('preview-templates plugin', () => {
  test('extracts a demo for every preview fence, with or without extra fence options', async () => {
    const page = await renderFixture();
    const demos = page.pluginData.demoComponents as DemoComponent[];

    expect(demos).toHaveLength(4);
    expect(page.rendered.match(/<DocfyDemo /g) ?? []).toHaveLength(4);
  });

  test('names the snippet after the marker, not the whole meta string', async () => {
    const page = await renderFixture();
    const demos = page.pluginData.demoComponents as DemoComponent[];

    expect(demos.map(d => d.chunks[0]!.type)).toEqual([
      'preview',
      'preview',
      'preview-template',
      'preview-template',
    ]);
    expect(page.rendered).not.toContain('@name="preview collapsible');
  });

  test('still applies the fence options to the extracted snippet code block', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('@collapsible={{true}}');
    expect(page.rendered).toContain('@showLineNumbers={{true}}');
    expect(page.rendered).toContain('@title="app/components/thing.gts"');
  });
});
