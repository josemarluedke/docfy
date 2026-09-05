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

## Default themes and aliases

By default, this preset highlights with the `github-light` / `github-dark`
theme pair, emitted as CSS variables (`--shiki-light` / `--shiki-dark`) so a
page can switch themes without re-highlighting and without any runtime
JavaScript.

It also registers these language aliases so fences written the way Ember
docs are actually written resolve to real grammars:

| Fence language | Resolves to  |
| -------------- | ------------ |
| `gts`          | `glimmer-ts` |
| `gjs`          | `glimmer-js` |
| `hbs`          | `handlebars` |

Every other language Shiki bundles (`js`, `ts`, `css`, `html`, `bash`, `md`,
`json`, `diff`, and hundreds more) works out of the box with no
configuration.

## Overriding themes

```ts
docfyShiki({
  themes: { light: 'github-light', dark: 'nord' },
});
```

Any theme bundled with Shiki can be used — see the
[Shiki theme list](https://shiki.style/themes).

## Extra language aliases

```ts
docfyShiki({
  langAlias: { svelte: 'html' },
});
```

`langAlias` is merged over this preset's defaults and is reflected in the
`language="..."` attribute this preset writes on the rendered `<pre>` for
each fence. Note that because `@docfy/core` drives its rehype pipeline
synchronously (`unified().runSync(...)`), this preset builds one Shiki
highlighter up front with every bundled language and theme already loaded,
rather than loading grammars on demand per request. An alias only resolves
to real tokenisation if it points at a language Shiki already bundles (which
covers the vast majority of cases); it cannot pull in a grammar from outside
Shiki's bundle at request time.

## Extra transformers

```ts
import { transformerNotationDiff } from '@shikijs/transformers';

docfyShiki({
  transformers: [transformerNotationDiff()],
});
```

`transformers` is appended after this preset's own defaults
(`transformerMetaHighlight`, `transformerMetaWordHighlight`, and two small
internal transformers that add the `language="..."` and `data-highlighted`
attributes described above).

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
