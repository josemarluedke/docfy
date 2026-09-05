import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import corePlugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';
import escapeCurliesInCode from '../src/docfy-plugins/escape-curlies-in-code.js';
import { loadDocfyConfig } from '../src/config.js';

/**
 * A rehype-stage plugin that stands in for a rehype pipeline having
 * mutated the hast tree between the mdast recording pass and the hast
 * rewrite pass: it appends a character to the text of the first `<pre>`
 * it finds, on every page. Registered ahead of `codeBlocks` in the plugins
 * list, its `runWithHast` runs first (plugins run in array order — see
 * `createPluginPipelineFor` in `@docfy/core`), so by the time `codeBlocks`
 * compares `textOf(pre)` against the fence text it recorded during
 * `runWithMdast`, the first block's text no longer matches.
 */
const corruptFirstPre = corePlugin({
  runWithHast(ctx): void {
    ctx.pages.forEach(page => {
      let done = false;

      visit(page.ast, 'element', node => {
        if (done || node.tagName !== 'pre') {
          return;
        }
        done = true;

        visit(node, 'text', textNode => {
          textNode.value += 'X';
        });
      });
    });
  },
});

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

    expect(opens).toHaveLength(7);
    expect(closes).toHaveLength(7);
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

  test('a single-quoted title containing a double quote does not break out of the attribute', async () => {
    const page = await renderFixture();

    // `parseFenceMeta` accepts `title='...'`, whose value may itself contain a
    // `"`. If the title were interpolated raw, that quote would close the
    // `@title="..."` attribute early and corrupt the invocation.
    expect(page.rendered).toContain('@title="say &quot;hi&quot;"');
    expect(page.rendered).not.toContain('@title="say "hi""');
  });

  test('a title containing curlies is escaped so it does not reach the template as a mustache', async () => {
    const page = await renderFixture();

    // The wrapper is emitted as a raw hast node, so `escapeCurliesInCode`
    // (which only descends into `code` elements) can never see this title —
    // it must be escaped here instead.
    expect(page.rendered).toContain('@title="\\{{not a mustache}}"');
    expect(page.rendered).not.toMatch(/@title="(?<!\\)\{\{not a mustache\}\}"/);
  });

  test('a hostile fence language does not break out of the attribute', async () => {
    const page = await renderFixture();

    // A fence's info string has no whitespace or quote restriction in
    // micromark, so `node.lang` can itself contain a `"`. If it were
    // interpolated raw, that quote would close the `@language="..."`
    // attribute early and let arbitrary markup/attributes follow.
    expect(page.rendered).toContain('@language="js&quot;onmouseover=alert(1)"');
    expect(page.rendered).not.toContain('@language="js"onmouseover=alert(1)"');
  });

  test('leaves a mismatched block unwrapped rather than mislabeling it with another block’s title', async () => {
    // Simulates the mdast/hast desync risk this guard exists for: something
    // between the two passes (here, `corruptFirstPre`) changes a `<pre>`'s
    // text so it no longer matches the fence `codeBlocks` recorded for it.
    const page = await renderFixture([corruptFirstPre, codeBlocks]);

    const opens = page.rendered.match(/<DocfyCodeBlock/g) ?? [];
    const closes = page.rendered.match(/<\/DocfyCodeBlock>/g) ?? [];

    // One fewer than the 7 fences in the fixture: the corrupted first block
    // is left unwrapped, every other block still gets wrapped normally.
    expect(opens).toHaveLength(6);
    expect(closes).toHaveLength(6);

    // The corrupted fence's own code must still be present in the output
    // (nothing was dropped), but with no `@title`/`@language` invocation
    // around it — in particular, it must not have picked up the *next*
    // block's title (`app/components/thing.gts`), which is what a naive
    // index-based pairing without this guard would produce.
    expect(page.rendered).toContain('const a = 1;\nX');
    expect(page.rendered).not.toContain('<DocfyCodeBlock @language="js">');
    expect(page.rendered).not.toMatch(
      /@title="app\/components\/thing\.gts"[\s\S]*const a = 1;\nX/
    );

    // The block that would have shifted into the corrupted block's slot
    // under naive index pairing is still correctly wrapped with its own
    // title.
    expect(page.rendered).toContain('@title="app/components/thing.gts"');
  });

  test('registers codeBlocks before escapeCurliesInCode in the real configured pipeline', async () => {
    // This pins the plugin order `config.ts` wires up. Reversed, bare `{{`
    // would survive into templates, AND the plugin's text-content pairing
    // guard in `rewrite()` would silently fail on every fence containing
    // `{{` (its escaped form no longer matches the recorded `block.code`),
    // leaving those blocks unwrapped. The rest of this suite exercises
    // `codeBlocks` directly with a hand-built plugin list, so it would stay
    // green even if `config.ts` registered the two in the wrong order — only
    // asserting on the actual configured pipeline catches that regression.
    const config = await loadDocfyConfig(process.cwd(), {
      root: process.cwd(),
      config: { sources: [{ pattern: '**/*.md', urlPrefix: 'docs' }] },
    });

    const plugins = config.plugins ?? [];
    const codeBlocksIndex = plugins.indexOf(codeBlocks);
    const escapeCurliesIndex = plugins.indexOf(escapeCurliesInCode);

    expect(codeBlocksIndex).toBeGreaterThanOrEqual(0);
    expect(escapeCurliesIndex).toBeGreaterThanOrEqual(0);
    expect(codeBlocksIndex).toBeLessThan(escapeCurliesIndex);
  });
});
