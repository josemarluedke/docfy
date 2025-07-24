---
order: 4
---

# Ember Vite

`@docfy/ember-vite` provides modern Vite integration for Docfy with Ember applications using `@embroider/vite`. Choose this integration for lightning-fast development builds with hot module replacement.

## Prerequisites

- `@embroider/vite` configured in your Ember app
- `@docfy/ember` for runtime components (covered in [Tutorial](./tutorial.md))

## Installation

```bash
npm install --save-dev @docfy/ember-vite
```

## Configuration

### Inline Configuration

Add the Docfy plugin directly to your `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import docfy from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfy(
      /** @type {import('@docfy/ember-vite').DocfyViteOptions} */
      {
        root: process.cwd(),
        hmr: true,
        config: {
          sources: [
            {
              root: '.',
              pattern: '**/*.md',
              urlPrefix: 'docs',
            },
          ],
        },
      }
    ),
    // ... other Embroider plugins
  ],
});
```

### Configuration File

For better organization, use a separate configuration file. Create `docfy.config.js` or `docfy.config.mjs`:

```js
// docfy.config.js
const path = require('path');

module.exports = {
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
  remarkPlugins: [
    // Add remark plugins
  ],
  repository: {
    url: 'https://github.com/username/repo',
    editBranch: 'main',
  },
};
```

Then use it in your Vite config:

```js
import { defineConfig } from 'vite';
import { docfyVite } from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    // ... other Embroider plugins
    docfyVite(), // Automatically loads docfy.config.js/mjs
  ],
});
```

### Custom Config File Path

Specify a custom configuration file location:

```js
import { defineConfig } from 'vite';
import { docfyVite } from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfyVite({
      configFile: 'config/my-docfy.config.js',
    }),
  ],
});
```

### Plugin Options

The plugin accepts these options:

```js
docfyVite({
  // Path to config file (optional)
  configFile: 'docfy.config.js', // default: 'docfy.config.js' or 'docfy.config.mjs'

  // Root directory (optional)
  root: process.cwd(), // default: process.cwd()

  // Enable HMR (optional)
  hmr: true, // default: true

  // Inline config (optional) - overrides config file
  config: {
    sources: [
      /* ... */
    ],
    // ... other docfy options
  },

  // Or any @docfy/core options directly
  sources: [
    /* ... */
  ],
  remarkPlugins: [
    /* ... */
  ],
  // ...
});
```

## Vite-Specific Features

### Hot Module Replacement (HMR)

The killer feature of the Vite integration is instant updates. Edit any markdown file and see changes reflected immediately in the browser without page reloads:

```bash
# Edit docs/my-component.md
# Browser updates instantly ⚡
```

### Development Performance

- **On-demand processing** - Only processes markdown files when requested
- **Incremental builds** - Only reprocesses changed files
- **Fast startup** - No need to process all docs during development server start

### Virtual Module Integration

Access processed data through Embroider's virtual module system:

```js
import { getDocfyOutput } from 'virtual:docfy/output';

const docfyData = getDocfyOutput();
```

## Advanced Configuration

### Multiple Sources

Configure multiple documentation sources with different URL schemas:

```js
// docfy.config.js
module.exports = {
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
      urlSchema: 'auto',
    },
    {
      root: path.join(__dirname, 'guides'),
      pattern: '**/*.md',
      urlPrefix: 'guides',
      urlSchema: 'manual',
    },
  ],
};
```

### Development vs Production

**Development:** Files processed on-demand for maximum speed
**Production:** All files processed during build for optimization

```bash
# Development - instant HMR
npm run start

# Production - full processing
npm run build
```

All [core configuration options](../configuration.md) are supported.

## TypeScript Support

Get full type safety in JavaScript using JSDoc annotations:

```js
import { defineConfig } from 'vite';
import { docfyVite } from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfyVite(
      /** @type {import('@docfy/ember-vite').DocfyViteOptions} */
      ({
        sources: [
          {
            root: path.resolve(__dirname, 'docs'),
            pattern: '**/*.md',
            urlPrefix: 'docs',
          },
        ],
      })
    ),
  ],
});
```

Or for TypeScript projects:

```ts
import type { DocfyViteOptions } from '@docfy/ember-vite';
import { defineConfig } from 'vite';
import { docfyVite } from '@docfy/ember-vite';

const config: DocfyViteOptions = {
  sources: [
    // fully typed configuration
  ],
};

export default defineConfig({
  plugins: [docfyVite(config)],
});
```
