# @docfy/plugin-shiki

An **opt-in** [Shiki](https://shiki.style) syntax-highlighting preset for
Docfy, with first-class support for Ember's `.gjs`/`.gts` file types.

This package is standalone: `shiki` is never a dependency of `@docfy/core` or
`@docfy/ember`. Consumers who want syntax highlighting install this package
and spread its return value into their own `rehypePlugins`.

## Why this exists

Wiring up Shiki (or `rehype-highlight`) by hand for a Docfy site normally
means re-deriving the same handful of settings every time: which themes to
use, how to map `gjs`/`gts`/`hbs` fence languages onto real grammars, and how
to enable `{1,3-5}`-style line highlighting. This preset packages all of
that up so you don't have to.

**Glimmer support is the main reason this package exists.** Shiki bundles
first-class `glimmer-js` and `glimmer-ts` TextMate grammars (scope
`source.gts`), so a `.gts`/`.gjs` code fence gets real tokenisation —
including inside `<template>` tags — instead of silently falling back to
plain JavaScript (or plain text).

## Installation

```bash
pnpm add @docfy/plugin-shiki
```

## Usage

```ts
import Docfy from '@docfy/core';
import docfyShiki from '@docfy/plugin-shiki';

const docfy = new Docfy({
  rehypePlugins: [
    // ...your other rehype plugins
    ...docfyShiki(),
  ],
});
```

## Why this preset builds its own highlighter

`@docfy/core` drives its rehype pipeline with `unified().runSync(...)` (see
`packages/core/src/-private/remark.ts`), never the async `.run()`/`.process()`.
Shiki's own `@shikijs/rehype` default export is async-only — it lazily boots a
singleton highlighter the first time the tree transformer runs — so wiring it
in directly makes `runSync` throw.

`@docfy/ember-cli` (the classic, non-Vite build) also loads a consumer's
`docfy.config.*` with a **synchronous** `require()`. A module that contains a
top-level `await` anywhere in its graph is an async ES module, and Node
throws `ERR_REQUIRE_ASYNC_MODULE` the moment such a config merely `import`s
it — so this package cannot use a top-level `await` either, even to build its
highlighter once at startup.

To stay synchronous end-to-end, this preset:

- Loads its grammars and themes via plain, **static** `import` statements
  (see "Supported languages" and "Supported themes" below) — never a dynamic
  `import()` or a top-level `await`.
- Builds one Shiki `HighlighterCore` at module load time via
  `createHighlighterCoreSync`, using the pure-JS regex engine (no WASM to
  load).
- Uses `@shikijs/rehype/core`'s `rehypeShikiFromHighlighter`, which — given an
  already-built highlighter and no lazy-loaded languages — returns a genuinely
  synchronous unified transformer.

## Supported languages

Preloading **every** language Shiki bundles (~200 grammars, ~11.6MB of JSON)
would cost real parse time at `import`, whether or not a given site uses most
of them. Instead, this preset preloads a curated set covering the glimmer
grammars that are the point of the package, plus the languages Docfy's own
docs (and typical Ember app docs) actually fence:

`glimmer-ts`, `glimmer-js`, `handlebars`, `javascript`, `typescript`, `jsx`,
`tsx`, `json`, `css`, `scss`, `html`, `markdown`, `shellscript`, `diff`,
`yaml`.

It also registers these language aliases so fences written the way Ember
docs are actually written resolve to the grammars above:

| Fence language | Resolves to  |
| -------------- | ------------ |
| `gts`          | `glimmer-ts` |
| `gjs`          | `glimmer-js` |
| `hbs`          | `handlebars` |

This alias table is fixed and is not configurable — see "Language aliases"
below for why.

### Unsupported languages

A fence whose language is not in the list above (for example ` ```rust `)
is **not** an error. `@shikijs/rehype` leaves any `<pre>` whose language isn't
loaded completely untouched: no `.shiki` wrapper, no theme classes, no
Shiki-applied highlighting — it renders as plain, unhighlighted fenced code,
exactly as if no highlighter were configured for it. A docs build never fails
because someone wrote a fence in a language this preset doesn't preload.

If you need another language, either send a PR adding it to the curated list
in `src/index.ts`, or configure your own Shiki highlighter (this preset's
source is a reasonably short template to copy).

## Supported themes

This preset statically preloads three themes: `github-light`, `github-dark`
(the defaults), and `nord`. As with languages, only preloaded themes can be
used — passing an unloaded theme name throws, because the underlying
highlighter is built once, synchronously, at import time and cannot fetch a
theme afterwards.

## Overriding themes

```ts
docfyShiki({
  themes: { light: 'github-light', dark: 'nord' },
});
```

## Language aliases

Earlier versions of this README documented a `langAlias` option. It has been
removed. Because this preset's highlighter is built once, synchronously, at
import time, an alias supplied at `docfyShiki({ langAlias: {...} })` call
time could only ever change the `data-language` attribute this preset writes
on the rendered `<pre>` — it could never register a new alias with Shiki's
grammar resolver, which is fixed by the time any call to `docfyShiki()`
happens. A caller adding, say, `{ svelte: 'html' }` would see their fence
mislabelled rather than actually highlighted as HTML. An option that appears
to work and silently does not is worse than no option, so it was removed
rather than kept as a trap.

The package's own three aliases (`gjs`, `gts`, `hbs`) are baked into the
highlighter directly and are unaffected by this.

## Extra transformers

```ts
import { transformerNotationDiff } from '@shikijs/transformers';

docfyShiki({
  transformers: [transformerNotationDiff()],
});
```

`transformers` is appended after this preset's own defaults
(`transformerMetaHighlight`, `transformerMetaWordHighlight`, and two small
internal transformers that add the `data-language="..."` and
`data-highlighted` attributes described above).

## Line highlighting

Marking specific lines in a fence, e.g.:

````md
```ts {2,4-5}
// ...
```
````

works because this preset wires up `transformerMetaHighlight` from
`@shikijs/transformers`. Line highlighting is **not** a feature of Shiki (or
of Docfy) on its own — it only works when this preset (or an equivalent
Shiki configuration that includes `transformerMetaHighlight`) is in use.
Highlighted lines get both a `highlighted` class and a `data-highlighted`
attribute, so you can style them with either `.highlighted` or
`[data-highlighted]` in your own CSS.

## License

This project is licensed under the [MIT License](LICENSE.md).
