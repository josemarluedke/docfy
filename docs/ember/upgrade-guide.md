---
order: 6
---

# Upgrade Guide

This guide helps you upgrade between different versions of Docfy's Ember integration packages.

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
