import { createHighlighterCoreSync, type ShikiTransformer } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { bundledLanguages } from 'shiki/langs';
import { bundledThemes } from 'shiki/themes';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { transformerMetaHighlight, transformerMetaWordHighlight } from '@shikijs/transformers';

export interface DocfyShikiOptions {
  /**
   * Light and dark themes, emitted as CSS variables so the page switches
   * themes without re-highlighting and without any runtime JavaScript.
   */
  themes?: { light: string; dark: string };

  /**
   * Extra language aliases, merged over the defaults below.
   */
  langAlias?: Record<string, string>;

  /**
   * Extra Shiki transformers, appended after the defaults.
   */
  transformers?: unknown[];
}

/**
 * Shiki bundles first-class `glimmer-js` and `glimmer-ts` TextMate grammars
 * (scope `source.gts`), so `.gjs`/`.gts` fences get real tokenisation rather
 * than falling back to plain JavaScript.
 */
const DEFAULT_LANG_ALIAS: Record<string, string> = {
  gjs: 'glimmer-js',
  gts: 'glimmer-ts',
  hbs: 'handlebars',
};

const DEFAULT_THEMES = { light: 'github-light', dark: 'github-dark' };

/**
 * `@docfy/core` drives its rehype pipeline with `unified().runSync(...)` (see
 * `packages/core/src/-private/remark.ts`), never the async `.run()`/`.process()`.
 * Shiki's own `@shikijs/rehype` default export is async-only — it lazily boots a
 * singleton highlighter the first time the tree transformer runs — so wiring it
 * in directly makes `runSync` throw `"runSync finished async. Use \`run\`
 * instead"` for every single page.
 *
 * To stay synchronous we build our own Shiki `HighlighterCore` up front, using
 * the synchronous `createHighlighterCoreSync` + the pure-JS regex engine (no
 * WASM to await), and load every bundled language and theme into it. That
 * one-time, module-scope cost (paid once via top-level await, ~1-2s) is what
 * lets every subsequent `docfyShiki(options)` call — and the `<pre>` render
 * that follows it inside `runSync` — stay fully synchronous no matter what
 * theme name a caller passes in.
 */
const highlighter = createHighlighterCoreSync({
  langs: await Promise.all(
    Object.values(bundledLanguages).map(load => load().then(m => m.default))
  ),
  themes: await Promise.all(Object.values(bundledThemes).map(load => load().then(m => m.default))),
  // Shiki mutates the `langAlias` object it's given (accumulating its own
  // built-in aliases into it), so pass a copy rather than the shared default.
  langAlias: { ...DEFAULT_LANG_ALIAS },
  engine: createJavaScriptRegexEngine(),
});

/**
 * Records the language actually requested for a fence (after applying this
 * preset's own alias table) as a plain `language="..."` attribute on the
 * `<pre>`. This makes the alias resolution independently observable in the
 * rendered HTML: a `gts` fence that silently fell back to plain text would
 * never reach this transformer with a real grammar match, and a broken alias
 * would show up as a mismatch between this attribute and the tokenised
 * output.
 */
function languageAttributeTransformer(langAlias: Record<string, string>): ShikiTransformer {
  return {
    name: 'docfy-shiki:language-attribute',
    pre(node) {
      const lang = this.options.lang;
      node.properties.language = langAlias[lang] ?? lang;
      return node;
    },
  };
}

/**
 * `transformerMetaHighlight` (from `@shikijs/transformers`) marks lines named
 * in a fence's `{1,3-5}` meta by adding a `highlighted` class to the line —
 * it does not add a `data-highlighted` attribute. Consumers that prefer to
 * style highlighted lines via `[data-highlighted]` (rather than matching a
 * class name that could collide with their own CSS) need that attribute too,
 * so this transformer mirrors the class onto a boolean data attribute. It
 * must run after `transformerMetaHighlight` in the `transformers` array so
 * the class has already been applied by the time this sees the line.
 */
function dataHighlightedAttributeTransformer(): ShikiTransformer {
  return {
    name: 'docfy-shiki:data-highlighted',
    line(node) {
      const classes = node.properties.class;
      const classList = Array.isArray(classes)
        ? classes
        : typeof classes === 'string'
          ? classes.split(/\s+/)
          : [];
      if (classList.includes('highlighted')) {
        node.properties['data-highlighted'] = '';
      }
      return node;
    },
  };
}

export default function docfyShiki(options: DocfyShikiOptions = {}): unknown[] {
  const langAlias = { ...DEFAULT_LANG_ALIAS, ...options.langAlias };

  function shikiRehypePlugin(): (tree: unknown) => unknown {
    const transformers: ShikiTransformer[] = [
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
      languageAttributeTransformer(langAlias),
      dataHighlightedAttributeTransformer(),
      ...((options.transformers ?? []) as ShikiTransformer[]),
    ];

    // `langAlias` is not read here: once the highlighter is built, its alias
    // table is fixed (see the module-scope comment above), so this per-call
    // options object only feeds `languageAttributeTransformer`'s output
    // label, not Shiki's own grammar resolution.
    return rehypeShikiFromHighlighter(highlighter as never, {
      themes: options.themes ?? DEFAULT_THEMES,
      defaultColor: false,
      transformers,
    }) as (tree: unknown) => unknown;
  }

  return [shikiRehypePlugin];
}
