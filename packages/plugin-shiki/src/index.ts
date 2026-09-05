import { createHighlighterCoreSync, type ShikiTransformer } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Static imports only. `@docfy/ember-cli` loads a consumer's `docfy.config.*`
// with a synchronous `require()` (see `packages/ember-cli/src/get-config.ts`).
// A top-level `await` anywhere in this module's graph turns it into an async
// ES module, and Node throws `ERR_REQUIRE_ASYNC_MODULE` the moment such a
// config merely `import`s this package. Static imports do not make a module
// async, so they're the only way to preload grammars/themes and still be
// usable from the classic (non-Vite) build.
//
// Each of these modules is a plain, synchronously-evaluated ES module that
// exports the parsed grammar/theme object (or, for grammars that embed other
// languages, an array of them) directly — nothing here is a lazy loader.
import glimmerTs from '@shikijs/langs/glimmer-ts';
import glimmerJs from '@shikijs/langs/glimmer-js';
import handlebars from '@shikijs/langs/handlebars';
import javascript from '@shikijs/langs/javascript';
import typescript from '@shikijs/langs/typescript';
import jsx from '@shikijs/langs/jsx';
import tsx from '@shikijs/langs/tsx';
import json from '@shikijs/langs/json';
import css from '@shikijs/langs/css';
import scss from '@shikijs/langs/scss';
import html from '@shikijs/langs/html';
import markdown from '@shikijs/langs/markdown';
import shellscript from '@shikijs/langs/shellscript';
import diff from '@shikijs/langs/diff';
import yaml from '@shikijs/langs/yaml';

import githubLight from '@shikijs/themes/github-light';
import githubDark from '@shikijs/themes/github-dark';
import nord from '@shikijs/themes/nord';

import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { transformerMetaHighlight, transformerMetaWordHighlight } from '@shikijs/transformers';

export interface DocfyShikiOptions {
  /**
   * Light and dark themes, emitted as CSS variables so the page switches
   * themes without re-highlighting and without any runtime JavaScript.
   *
   * Only themes preloaded by this package (currently `github-light`,
   * `github-dark`, and `nord`) can be used — see "Supported themes" in the
   * README.
   */
  themes?: { light: string; dark: string };

  /**
   * Extra Shiki transformers, appended after the defaults.
   */
  transformers?: unknown[];
}

/**
 * Shiki bundles first-class `glimmer-js` and `glimmer-ts` TextMate grammars
 * (scope `source.gts`), so `.gjs`/`.gts` fences get real tokenisation rather
 * than falling back to plain JavaScript. This alias table is fixed: it is
 * baked into the highlighter at construction time below and is not
 * configurable, because the sync highlighter architecture this package
 * relies on resolves aliases once, up front (see the README's "Language
 * aliases" section for why a per-call `langAlias` option was removed).
 */
const DEFAULT_LANG_ALIAS: Record<string, string> = {
  gjs: 'glimmer-js',
  gts: 'glimmer-ts',
  hbs: 'handlebars',
};

const DEFAULT_THEMES = { light: 'github-light', dark: 'github-dark' };

/**
 * The curated set of languages this preset preloads. This is deliberately
 * NOT "every language Shiki bundles" (~200 grammars, ~11.6MB of JSON) —
 * preloading everything would cost real parse time at import for every
 * consumer, whether or not they use most of those languages. This list
 * covers the glimmer grammars that are the point of this package, plus the
 * languages Docfy's own docs (and typical Ember app docs) actually fence:
 * TypeScript/JavaScript and their JSX variants, Handlebars, JSON, CSS/SCSS,
 * HTML, Markdown, shell, diff, and YAML.
 *
 * A fence in a language outside this set is NOT an error: `rehypeShiki` (see
 * below) leaves any `<pre>` whose language isn't loaded untouched — no
 * `.shiki` wrapper, no theme, no crash — so a docs build never dies because
 * someone wrote a ```rust fence. See the "Unsupported languages" section of
 * the README.
 */
const highlighter = createHighlighterCoreSync({
  langs: [
    glimmerTs,
    glimmerJs,
    handlebars,
    javascript,
    typescript,
    jsx,
    tsx,
    json,
    css,
    scss,
    html,
    markdown,
    shellscript,
    diff,
    yaml,
  ],
  themes: [githubLight, githubDark, nord],
  // Shiki mutates the `langAlias` object it's given (accumulating its own
  // built-in aliases into it), so pass a copy rather than the shared default.
  langAlias: { ...DEFAULT_LANG_ALIAS },
  // The pure-JS regex engine avoids loading a WASM binary. It cannot
  // translate every Oniguruma pattern the way the WASM-backed `oniguruma`
  // engine can, so `forgiving: true` is required — without it, an
  // untranslatable pattern in any preloaded grammar throws at construction
  // time (i.e. at `import`), crashing every consumer's build rather than
  // degrading the one language affected.
  engine: createJavaScriptRegexEngine({ forgiving: true }),
});

/**
 * Records the language actually requested for a fence (after applying this
 * preset's own alias table) as a `data-language` attribute on the `<pre>`.
 * This makes the alias resolution independently observable in the rendered
 * HTML: a `gts` fence that silently fell back to plain text would never
 * reach this transformer with a real grammar match. It is intentionally a
 * secondary signal in the test suite — the primary evidence that a language
 * actually tokenised is Shiki's own per-token `<span style="...">` output,
 * which this attribute cannot fake.
 */
function languageAttributeTransformer(): ShikiTransformer {
  return {
    name: 'docfy-shiki:language-attribute',
    pre(node) {
      const lang = this.options.lang;
      node.properties['data-language'] = DEFAULT_LANG_ALIAS[lang] ?? lang;
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
  function shikiRehypePlugin(): (tree: unknown) => unknown {
    const transformers: ShikiTransformer[] = [
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
      languageAttributeTransformer(),
      dataHighlightedAttributeTransformer(),
      ...((options.transformers ?? []) as ShikiTransformer[]),
    ];

    return rehypeShikiFromHighlighter(highlighter as never, {
      themes: options.themes ?? DEFAULT_THEMES,
      defaultColor: false,
      transformers,
      // A fence whose language was never preloaded (and isn't a "special"
      // pseudo-language like `text`/`ansi`) is left as plain, unhighlighted
      // code rather than throwing. `lazy` defaults to `false`, so there is no
      // attempt to fetch a grammar on demand either — this preset is fully
      // synchronous end to end.
    }) as (tree: unknown) => unknown;
  }

  return [shikiRehypePlugin];
}
