# @docfy/ember-vite

A Vite plugin for integrating Docfy with Ember apps using `@embroider/vite`.

## Features

- 🚀 **Modern Ember Integration**: Works seamlessly with `@embroider/vite`
- 📄 **GJS Component Generation**: Creates modern `.gjs` components with `<template>` syntax
- 🔥 **Hot Module Replacement**: Fast development with HMR support for markdown files
- 🎯 **Virtual Modules**: Efficient virtual module system for Docfy outputs
- 📦 **Asset Generation**: Handles static assets and JSON outputs
- 🔧 **TypeScript Support**: Full TypeScript support with proper types

## Installation

```bash
npm install @docfy/ember-vite
# or
yarn add @docfy/ember-vite
```

## Usage

### Basic Setup

Add the plugin to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import docfyVitePlugin from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfyVitePlugin({
      root: resolve(__dirname),
      // Additional Docfy configuration options
    })
  ]
});
```

### With @embroider/vite

```javascript
import { defineConfig } from 'vite';
import { buildOnce } from '@embroider/vite';
import docfyVitePlugin from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    docfyVitePlugin({
      // Docfy configuration
    }),
    buildOnce({
      // Embroider configuration
    })
  ]
});
```

## Configuration

The plugin accepts the same configuration options as `@docfy/core`, plus some additional options:

```typescript
interface DocfyVitePluginOptions {
  /**
   * Root directory for the Ember app
   */
  root?: string;

  /**
   * Include patterns for markdown files
   * @default ['**/*.md']
   */
  include?: string | string[];

  /**
   * Exclude patterns for markdown files
   * @default ['node_modules/**']
   */
  exclude?: string | string[];

  /**
   * Enable hot module replacement for markdown files
   * @default true
   */
  hmr?: boolean;

  // All @docfy/core options are also supported
  sources?: SourceConfig[];
  plugins?: PluginList;
  remarkPlugins?: RemarkPlugin[];
  rehypePlugins?: RehypePlugin[];
  // ... etc
}
```

## Virtual Modules

The plugin provides several virtual modules that you can import in your Ember app:

```javascript
// Get the nested page metadata
import docfyOutput from 'virtual:docfy-output';

// Get all page URLs
import docfyUrls from 'virtual:docfy-urls';

// Get component snippets
import docfySnippets from 'virtual:docfy-snippets';
```

## GJS Component Generation

The plugin generates modern GJS components using the `<template>` syntax:

```javascript
// Generated component example
import Component from '@glimmer/component';

export default class MyDemoComponent extends Component {
  <template>
    <div class="demo-content">
      {{!-- Your markdown-generated content --}}
    </div>
  </template>
}
```

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Compatibility

- **Node.js**: >= 16
- **Vite**: >= 4.0.0
- **@embroider/vite**: >= 1.0.0
- **Ember**: >= 3.28 (with Embroider)

## License

MIT

## Contributing

Contributions are welcome! Please see the main [Docfy repository](https://github.com/josemarluedke/docfy) for contribution guidelines.