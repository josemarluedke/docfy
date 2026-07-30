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
    }),
  ],
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
    }),
  ],
});
```

## Configuration

The plugin accepts the same configuration options as `@docfy/core`, plus some additional options:

```typescript
interface DocfyViteOptions {
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

  /**
   * Static text export for non-JS clients. See "Static Export" below.
   */
  staticExport?: {
    enabled?: boolean;
    markdown?: boolean;
    llmsTxt?: boolean;
    llmsFullTxt?: boolean;
    siteUrl?: string;
    projectDescription?: string;
    projectName?: string;
  };

  // All @docfy/core options are also supported
  sources?: SourceConfig[];
  plugins?: PluginList;
  remarkPlugins?: RemarkPlugin[];
  rehypePlugins?: RehypePlugin[];
  // ... etc
}
```

## Static Export

Emit a statically-servable, text-only mirror of your docs so AI agents, crawlers, and any
non-JavaScript client can read them. Off by default, and **build-only** — nothing is emitted
during `vite dev`.

```javascript
docfyVitePlugin({
  staticExport: {
    enabled: true,
    projectDescription: 'Docfy is a modular JavaScript tool to help build documentation sites.',
  },
});
```

This writes into your build output:

- `<page-url>.md` for every page, at the same path as the live route plus a `.md` suffix
  (`/docs/getting-started` → `dist/docs/getting-started.md`). Index routes become `index.md`.
- `llms.txt` — a compact, links-only index grouped by section, following the
  [llms.txt convention](https://llmstxt.org).
- `llms-full.txt` — every page's content concatenated in the same order.

By default, links in `llms.txt` and `llms-full.txt` are root-relative (e.g. `/docs/about.md`),
which is valid per the llms.txt spec and works on any origin — deploy previews, forks, staging,
and local builds — with no configuration. Set `siteUrl` to emit absolute links instead, which is
useful when the text is consumed detached from its origin:

```javascript
docfyVitePlugin({
  staticExport: {
    enabled: true,
    siteUrl: 'https://docfy.dev',
  },
});
```

### Options

| Option               | Type      | Default | Description                                                                                                                                                                                             |
| -------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | `false` | Master switch. The rest of these options are no-ops unless this is `true`.                                                                                                                              |
| `markdown`           | `boolean` | `true`  | Emit one `.md` file per page. Only takes effect when `enabled` is `true`.                                                                                                                               |
| `llmsTxt`            | `boolean` | `true`  | Emit `llms.txt`. Only takes effect when `enabled` is `true`.                                                                                                                                            |
| `llmsFullTxt`        | `boolean` | `true`  | Emit `llms-full.txt`. Only takes effect when `enabled` is `true`.                                                                                                                                       |
| `siteUrl`            | `string`  | —       | Absolute http(s) site origin for links. Optional — omit it for root-relative links; set it for absolute links. May include a path (for docs served under a subpath) but not a query string or fragment. |
| `projectName`        | `string`  | —       | Project name emitted as the H1 heading at the top of `llms.txt`, per the llms.txt convention.                                                                                                           |
| `projectDescription` | `string`  | —       | Short blurb placed at the top of `llms.txt`, after the H1 (if any), as a blockquote.                                                                                                                    |

### Customizing a page's exported Markdown

By default each page exports its raw Markdown source with the frontmatter block stripped. To
export something different — for example replacing a custom component tag with a real Markdown
table — set `pluginData.staticMarkdown` from a Docfy plugin:

```js
export default {
  runAfter(ctx) {
    ctx.pages.forEach(page => {
      page.pluginData.staticMarkdown = page.markdown.replace(
        /<Signature @component="(\w+)" \/>/g,
        (_, name) => renderSignatureTable(name)
      );
    });
  },
};
```

Use `runAfter` and operate on Markdown text, not the AST. By that point `page.ast` has already
been converted to hast and is what the live route templates are rendered from — mutating it
would change the rendered app. `page.markdown` is raw source that nothing else reads, so writing
a derived value into `pluginData.staticMarkdown` cannot affect the SPA build.

Set `page.pluginData.staticMarkdown`, not `page.meta.pluginData.staticMarkdown` — the latter is
silently ignored by the static export **and** is serialized into the app's client JS bundle (via
the virtual Docfy output module), so putting full page Markdown there would inline every page's
content into the shipped bundle.

## Virtual Modules

The plugin provides several virtual modules that you can import in your Ember app:

```javascript
// Get the nested page metadata
import docfyOutput from '@docfy/ember/output:virtual';
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
