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
  `import()` or a top-level `await`. This applies just as much to any extra
  grammar you pass via `langs` (see "Adding a language" below).
- Builds a Shiki `HighlighterCore` via `createHighlighterCoreSync`, using the
  pure-JS regex engine (no WASM to load). Calling `docfyShiki()` with no
  `langs`/`langAlias` reuses one memoized highlighter across calls, built the
  first time it's needed rather than at `import` time — a consumer that
  imports this package but never calls `docfyShiki()` doesn't pay for it at
  all. Passing `langs` and/or `langAlias` builds a dedicated highlighter for
  that call instead, since `langAlias` can only be set at construction time
  (see "Language aliases" below).
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

You can add to (or override) this table with the `langAlias` option — see
"Adding a language" below.

### Adding a language

A fence whose language is not in the curated list above (for example
` ```rust `) is, by default, **not** an error: `@shikijs/rehype` leaves any
`<pre>` whose language isn't loaded completely untouched — no `.shiki`
wrapper, no theme classes, no Shiki-applied highlighting — it renders as
plain, unhighlighted fenced code, exactly as if no highlighter were
configured for it. A docs build never fails because someone wrote a fence in
a language this preset doesn't preload.

If you actually want that language highlighted, pass its grammar via the
`langs` option. Each entry is a statically-imported module from
`@shikijs/langs` (or any other Shiki-compatible grammar you import
yourself) — never a dynamic `import()`, since this package has to stay
synchronous end-to-end (see "Why this preset builds its own highlighter"
above):

```ts
import rust from '@shikijs/langs/rust';
import shiki from '@docfy/plugin-shiki';

export default {
  rehypePlugins: [autolinkHeadings, ...shiki({ langs: [rust] })],
};
```

A ` ```rust ` fence now tokenizes for real. `langs` is additive — it doesn't
replace the curated set this preset already preloads.

If the language you need is only reachable under a different fence name (for
example your docs use ` ```rs ` rather than ` ```rust `), pair `langs` with
`langAlias`, which is merged over this preset's own `gjs`/`gts`/`hbs` table:

```ts
shiki({ langs: [rust], langAlias: { rs: 'rust' } });
```

`langAlias` on its own (without a matching `langs` entry) cannot make a new
language highlight — see "Language aliases" below for why, and why the two
options work together the way they do.

## Supported themes

This preset statically preloads three themes: `github-light`, `github-dark`
(the defaults), and `nord`, and — unlike languages — there is currently no
option to add more; passing an unloaded theme name throws, because the
underlying highlighter is built synchronously and cannot fetch a theme
afterwards.

## Overriding themes

```ts
docfyShiki({
  themes: { light: 'github-light', dark: 'nord' },
});
```

## Language aliases

An earlier version of this package removed a `langAlias` option, because at
the time the highlighter was built once, synchronously, at *module import*
time — before `docfyShiki(options)` was ever called. An alias supplied at
call time could only ever change the `data-language` attribute this preset
writes on the rendered `<pre>`; it could never register a new alias with
Shiki's grammar resolver, which was already fixed by then. A caller adding,
say, `{ svelte: 'html' }` would see their fence mislabelled rather than
actually highlighted as HTML — an option that appears to work and silently
does not, which is worse than no option.

`langAlias` is back because that constraint no longer holds: the highlighter
is now built inside `docfyShiki()` itself (see "Adding a language" above), so
an alias supplied there is baked into the same construction call as any
`langs` you pass alongside it, and genuinely participates in grammar
resolution. `langAlias` merges *over* the package's own `gjs`/`gts`/`hbs`
table — it can override one of those three, but not remove the other two.

Passing `langAlias` without a matching `langs` entry (or one of the
languages this preset already preloads) still can't highlight anything new —
an alias can only point at a grammar that's actually loaded. But it no
longer looks like it worked when it didn't: a fence whose alias points at an
unloaded grammar is left completely untouched (see "Adding a language"
above) — no `data-language` attribute either, exactly like any other
unsupported language — rather than being mislabelled with a `data-language`
that implies it highlighted.

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
