---
order: 3
---

# Ember CLI

`@docfy/ember-cli` provides classic Ember CLI integration for Docfy. Choose this integration for traditional Ember applications with full static site generation support.

## Prerequisites

- Classic Ember CLI application
- Node `>=22.22.2`
- `@docfy/ember` for runtime components (covered in [Tutorial](./tutorial.md))

## Installation

```bash
npm install --save-dev @docfy/ember-cli
```

## Configuration File

Create `.docfy-config.js` in your project root (note the dot prefix):

```js
const path = require('path');

module.exports = {
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
};
```

`.docfy-config.js`, `.docfy-config.mjs` and `.docfy-config.cjs` are all
supported, and the file is loaded synchronously either way — Node's support for
`require()` of ES modules means the classic build no longer has to care which
module format you picked.

The same applies to the plugins you load from it. Most of the remark/rehype
ecosystem is ESM-only these days, and a CommonJS config can `require()` those
plugins directly; `require()` returns the module namespace, so reach for
`.default`:

```js
// .docfy-config.js
const path = require('path');
const highlight = require('rehype-highlight').default;
const autolinkHeadings = require('rehype-autolink-headings').default;

module.exports = {
  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }], highlight],
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
};
```

Or the same thing as ESM, where imports need no unwrapping:

```js
// .docfy-config.mjs
import path from 'path';
import highlight from 'rehype-highlight';
import autolinkHeadings from 'rehype-autolink-headings';

export default {
  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }], highlight],
  sources: [
    {
      root: path.join(import.meta.dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
};
```

> **The one limitation**: a config using **top-level `await`** cannot be loaded,
> because Ember CLI's build is synchronous. Docfy fails with an explicit message
> if you try. Move the async work into a Docfy plugin, or use
> [@docfy/ember-vite](./ember-vite.md), which loads the config asynchronously.

### Syntax highlighting

Highlighting runs as a rehype plugin. Combining `rehype-highlight` with
[`highlightjs-glimmer`](https://github.com/NullVoxPopuli/highlightjs-glimmer)
gives real `gjs`/`gts`/`hbs` highlighting instead of the handlebars grammar:

```js
// .docfy-config.js
const highlight = require('rehype-highlight').default;
const { glimmer } = require('highlightjs-glimmer');
const { common } = require('lowlight');

module.exports = {
  rehypePlugins: [
    [
      highlight,
      {
        // `languages` replaces rehype-highlight's defaults rather than
        // extending them, so spread lowlight's `common` back in.
        languages: { ...common, glimmer, hbs: glimmer, handlebars: glimmer },
        aliases: { javascript: ['gjs'], typescript: ['gts'] },
      },
    ],
  ],
  // ...
};
```

Docfy escapes `{{` inside code blocks for you, after highlighting has run, so
the highlighted markup does not get parsed as a mustache by Ember's template
compiler. You do not need `remarkHbsOptions.escapeCurliesCode` for this — Docfy
manages that option itself.

## Ember CLI-Specific Features

### Build-time Processing

All markdown processing happens during the Ember CLI build phase. This means:

- **Static generation** - All routes and content are generated at build time
- **Bundle optimization** - Processed content is included in your app bundle
- **No runtime processing** - Fast page loads since everything is pre-built

### Preview Templates

Ember CLI integration supports a special `preview-template` syntax for quick demos:

````md
# Quick Button Demo

```hbs preview-template
<Button @variant='primary' @onClick={{this.handleClick}}>
  Click me!
</Button>
```
````

This creates a demo component with an empty Glimmer component class, perfect for simple examples.

### Static Site Generation with Prember

Generate fully static documentation sites that work without JavaScript:

```js
// ember-cli-build.js
const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // ... your app config
  });

  // Add prember for static site generation
  return require('prember').prerender(app, {
    urls: [
      '/docs',
      '/docs/installation',
      '/docs/components/button',
      // Add all your documentation URLs
    ],
  });
};
```

This generates static HTML files that can be deployed to any CDN or static hosting service.

## Advanced Configuration

### Ember CLI Build Integration

The addon automatically integrates with your Ember CLI build process. No additional configuration needed for basic usage.

### Custom Processing

Add custom Docfy plugins for specialized processing:

```js
// .docfy-config.js
module.exports = {
  plugins: [
    // Custom processing plugins
    require('./lib/my-custom-plugin'),
  ],
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
};
```

### Monorepo Support

Perfect for monorepos where you want to collect docs from multiple packages:

```js
// .docfy-config.js
module.exports = {
  sources: [
    // Main documentation
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
    // Package-specific docs
    {
      root: path.join(__dirname, 'packages'),
      pattern: '**/docs/**/*.md',
      urlPrefix: 'packages',
      urlSchema: 'manual',
    },
  ],
};
```

### Build Performance

For large documentation sites, you can optimize build performance:

```js
// ember-cli-build.js
module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Disable source maps in development for faster builds
    sourcemaps: {
      enabled: false,
    },
  });

  return app;
};
```

All configuration options from [@docfy/core](../configuration.md) are supported.
