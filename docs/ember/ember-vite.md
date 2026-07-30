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

  // Static text export for non-JS clients (optional) - see "Static Export" below
  staticExport: {
    enabled: true, // default: false
  },

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
import { getDocfyOutput } from '@docfy/ember/output:virtual';

const docfyData = getDocfyOutput();
```

### Static Export

A Docfy site is client-rendered, so a plain HTTP request returns the app shell rather than your
content. Crawlers, `curl`, and AI coding agents fetching a page get markup with no documentation
in it.

Enabling `staticExport` emits a text-only mirror of your docs alongside the app:

```js
docfyVite({
  staticExport: {
    enabled: true,
  },
});
```

That writes three kinds of file into your build output:

- **`<page-url>.md`** for every page, at the same path as the live route plus a `.md` suffix. The
  route `/docs/getting-started` gets `dist/docs/getting-started.md`. Index routes become
  `index.md`.
- **`llms.txt`** — a compact index of every page, grouped by section, following the
  [llms.txt convention](https://llmstxt.org).
- **`llms-full.txt`** — every page's content concatenated into one file.

The export is **build-only**. Nothing is emitted during `vite dev`, so your source tree stays
clean while you work.

#### Options

| Option               | Type      | Default              | Description                                                                                       |
| -------------------- | --------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `enabled`            | `boolean` | `false`              | Master switch. The rest are no-ops unless this is `true`.                                         |
| `markdown`           | `boolean` | `true`               | Emit one `.md` file per page.                                                                     |
| `llmsTxt`            | `boolean` | `true`               | Emit `llms.txt`.                                                                                  |
| `llmsFullTxt`        | `boolean` | `true`               | Emit `llms-full.txt`.                                                                             |
| `siteUrl`            | `string`  | —                    | Absolute origin for links. Omit for root-relative links; set for absolute ones.                   |
| `projectName`        | `string`  | `package.json` name  | H1 heading at the top of `llms.txt`.                                                              |
| `projectDescription` | `string`  | —                    | Short blurb after the H1, as a blockquote.                                                        |

#### Relative or absolute links

By default the links inside `llms.txt` and `llms-full.txt` are root-relative:

```
- [Getting Started](/docs/getting-started.md)
```

This is valid per the llms.txt spec and stays correct wherever the site is served — production,
deploy previews, forks, or `localhost` — with no configuration. Set `siteUrl` when you want
absolute links instead, which helps consumers that read the text detached from its origin:

```js
docfyVite({
  staticExport: {
    enabled: true,
    siteUrl: 'https://docfy.dev',
  },
});
```

#### Customizing what a page exports

Each page exports its raw markdown source with the frontmatter block stripped. When a page relies
on a custom component that only renders in the browser, the exported text would contain the
component tag rather than its content. To substitute something meaningful, set
`pluginData.staticMarkdown` from a Docfy plugin:

```js
export default {
  runAfter(ctx) {
    ctx.pages.forEach(page => {
      page.pluginData.staticMarkdown = page.markdown.replace(
        /<ApiTable @of="(\w+)" \/>/g,
        (_, name) => renderMarkdownTable(name)
      );
    });
  },
};
```

Use `runAfter` and work on markdown text rather than the AST. By that point `page.ast` has been
converted to hast and is what your live routes render from, so mutating it would change the app
itself. `page.markdown` is raw source that nothing else reads, which is why writing a derived
value into `pluginData.staticMarkdown` cannot affect the rendered site.

Set it on `page.pluginData`, not `page.meta.pluginData` — the latter is ignored by the export and
is serialized into the app's JavaScript bundle, so putting page content there would ship every
page's markdown to the browser.

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
