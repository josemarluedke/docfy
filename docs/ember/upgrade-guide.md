---
order: 6
---

# Upgrade Guide

This guide helps you upgrade between different versions of Docfy's Ember integration packages.

## Upgrading to v0.13.x

Version 0.13.0 moves Docfy onto the current unified/remark stack (unified 11,
remark 11, rehype 11). Docfy's own packages are now ES modules.

### Node version

Docfy now requires Node `^20.19.0 || >=22.12.0`. This is not negotiable: those
are the versions where `require()` of an ES module works, which is what allows
the classic Ember CLI build and CommonJS config files to keep working against
ESM-only packages.

### Your config file keeps working

There is no forced migration to `.mjs`. A CommonJS `.docfy-config.js` is still
fully supported, including `require()`-ing ESM-only remark/rehype plugins.
`@docfy/ember-cli` now also accepts `.docfy-config.mjs` and `.docfy-config.cjs`.

The one thing a classic-build config cannot do is use top-level `await` — Ember
CLI's build is synchronous. Docfy raises an explicit error if it finds one.
`@docfy/ember-vite` has no such restriction.

### Syntax highlighting must move to rehype

This is the change most projects will actually have to make. `remark-highlight.js`
and `@mapbox/rehype-prism` are unmaintained and pinned to highlight.js 10 / old
refractor builds, and they do not work with unified 11.

```diff
-import highlight from 'remark-highlight.js';
+import highlight from 'rehype-highlight';

-  remarkPlugins: [highlight],
+  rehypePlugins: [highlight],
```

Use [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight) for
highlight.js or [`rehype-prism-plus`](https://github.com/timlrx/rehype-prism-plus)
for Prism. Because highlight.js 11 now works, so does
[`highlightjs-glimmer`](https://github.com/NullVoxPopuli/highlightjs-glimmer):

```js
import highlight from 'rehype-highlight';
import { glimmer } from 'highlightjs-glimmer';
import { common } from 'lowlight';

export default {
  rehypePlugins: [
    [
      highlight,
      {
        languages: { ...common, glimmer, hbs: glimmer, handlebars: glimmer },
        aliases: { javascript: ['gjs'], typescript: ['gts'] },
      },
    ],
  ],
};
```

> **`languages` replaces the defaults, it does not extend them.**
> `rehype-highlight` uses `options.languages || common`, so passing your own map
> silently turns off highlighting for every other language. Spread lowlight's
> `common` back in (add `lowlight` as a dependency to import it).

**If your app depends on `highlight.js` directly, leave that dependency where it
is.** `rehype-highlight` brings its own copy via `lowlight`. Bumping a direct
`highlight.js` 10 dependency to 11 at the same time is an unrelated migration
and will break any code of yours that registers languages by hand.

### Curly escaping moved after highlighting

Docfy escapes `{{` inside code blocks so Ember's template compiler does not read
them as mustaches. That used to happen while the document was still markdown,
which broke as soon as a rehype highlighter started injecting `<span>`s into code
blocks afterwards. Docfy now escapes at the HTML stage, after all rehype plugins
have run.

As a result, Docfy manages `remarkHbsOptions.escapeCurliesCode` and
`escapeCurliesInlineCode` itself. **Remove those options from your config** if you
set them; setting `escapeCurliesCode: false` alongside a highlighter is what
produces errors like:

```
Parse error on line 23:
...tuation mustache">{{<span class="hljs-cl
-----------------------^
```

### Other deprecated plugins

```diff
-import autolinkHeadings from 'remark-autolink-headings';
+import autolinkHeadings from 'rehype-autolink-headings';

-  remarkPlugins: [autolinkHeadings],
+  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }]],
```

`remark-slug` and `remark-autolink-headings` are both deprecated. Docfy no longer
depends on `remark-slug` at all — heading ids are generated internally and are
unchanged, so your anchor links keep working.

Also worth bumping if you use them: `remark-code-import` to `^1.0.0`,
`remark-math` to `^6.0.0`, `rehype-katex` to `^7.0.0`. Note that `remark-math` 6
renders un-`katex`'d math as `<code class="language-math">` rather than
`<span class="math">`.

#### remark-code-import needs a `rootDir`

`remark-code-import` v1 refuses to read files outside `rootDir`, which defaults
to the process working directory. In a monorepo — or any setup where the docs
live outside the app being built — you have to say where the root is:

```js
import path from 'path';
import codeImport from 'remark-code-import';

export default {
  remarkPlugins: [[codeImport, { rootDir: path.join(import.meta.dirname, '..') }]],
};
```

Without it you get `Attempted to import code from "…", which is outside from the
rootDir "…"`.

### If you use @docfy/core directly

Plain `require('@docfy/core')` now returns a module namespace rather than the
class:

```diff
-const Docfy = require('@docfy/core');
+const Docfy = require('@docfy/core').default;
```

TypeScript consumers using `import Docfy from '@docfy/core'` with
`esModuleInterop`, and anything already using ESM `import`, need no change.

Deep imports from ESM need a file extension:

```diff
-import plugin from '@docfy/core/lib/plugin';
+import plugin from '@docfy/core/lib/plugin.js';
```

Type-only imports such as `@docfy/core/lib/types` are erased at compile time and
work either way.

## Upgrading to v0.10.x

Version 0.10.0 introduced a major architectural change with the new package structure. This section helps you migrate from previous versions to the new modular architecture.

### Package Structure Changes

#### Previous Architecture

```
@docfy/ember - Single package with build integration + components
```

#### New Architecture

```
@docfy/ember - Runtime components only (v2 addon)
@docfy/ember-cli - Classic build integration + components
@docfy/ember-vite - Modern Vite integration + components
```

### Migration Paths

#### From @docfy/ember (Classic)

If you were using `@docfy/ember` with classic Ember CLI builds:

##### 1. Update Package Dependencies

```bash
# Install new packages
npm install --save-dev @docfy/ember-cli
```

**Important:** You now need both packages:

- `@docfy/ember-cli` for build-time markdown processing
- `@docfy/ember` for runtime components

##### 2. Configuration

Your existing `.docfy-config.js` continues to work without changes.

#### To @docfy/ember-vite (Recommended for New Projects)

If you want to migrate to the modern Vite build system:

##### 1. Vite App

Make sure your Ember app is set up with `@embroider/vite`.

##### 2. Install Dependencies

```bash
# Install Docfy packages
npm install --save-dev @docfy/ember-vite
```

##### 3. Configure Vite

Create or update `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import { babel } from '@rollup/plugin-babel';
import { docfyVite } from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfyVite({
      sources: [
        {
          root: path.resolve(__dirname, 'docs'),
          pattern: '**/*.md',
          urlPrefix: 'docs',
        },
      ],
    }),
    // ... Embroider Vite plugins
  ],
});
```

### Breaking Changes in v0.10.x

#### Component Location

Components are now provided by the `@docfy/ember` runtime package as a v2 addon:

```js
// All packages now use the same runtime components
import { DocfyOutput, DocfyLink } from '@docfy/ember';
```

### New Features in v0.10.x

#### Better TypeScript Support

All packages now include comprehensive TypeScript definitions:

```ts
import type { DocfyViteOptions } from '@docfy/ember-vite';
import type { PageMetadata, NestedPageMetadata } from '@docfy/core';
```

### Troubleshooting v0.10.x Upgrade

#### Build Errors

If you encounter build errors after migration:

1. **Clear cache**: Delete `node_modules`, `dist`, and `tmp` directories, then reinstall
2. **Check imports**: Ensure you're importing from the correct packages
3. **Verify configuration**: Make sure your configuration matches the new format

#### Runtime Errors

If components aren't rendering:

1. **Check service**: Ensure the Docfy service is properly injected
2. **Verify data**: Check that markdown files are being processed correctly
3. **Template syntax**: Ensure you're using the correct component APIs

#### Performance Issues

If builds are slow:

1. **Use Vite**: Consider migrating to `@docfy/ember-vite` for faster builds
2. **Optimize sources**: Limit the scope of your markdown file patterns
3. **Cache configuration**: Ensure proper caching is enabled

### Benefits of Migration

The new architecture provides:

- **Better separation of concerns** - Runtime vs build-time packages
- **Faster development builds** - With Vite integration
- **Improved TypeScript support** - Better type definitions
- **More flexible deployment** - Choose your build system
- **Future-proof architecture** - Ready for Ember's modern build pipeline

## Getting Help

If you encounter issues during migration:

1. Check the [GitHub Issues](https://github.com/josemarluedke/docfy/issues)
2. Review the updated documentation for each package
3. Create a new issue with your specific migration scenario
