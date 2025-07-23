---
order: 3
---

# Ember CLI

`@docfy/ember-cli` provides classic Ember CLI integration for Docfy. Choose this integration for traditional Ember applications with full static site generation support.

## Prerequisites

- Classic Ember CLI application
- `@docfy/ember` for runtime components (covered in [Tutorial](./tutorial.md))

## Installation

```bash
npm install --save-dev @docfy/ember-cli
```

## Configuration File

Create `docfy.config.js` in your project root:

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
// docfy.config.js
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

All configuration options from [@docfy/core](../../configuration.md) are supported.
