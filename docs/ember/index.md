---
order: 1
title: Getting Started
---

# Getting Started

Docfy brings powerful documentation capabilities to Ember.js applications with a modern, modular architecture. Whether you're building a component library, design system, or comprehensive documentation site, Docfy provides the tools you need.

## How It Works

Docfy transforms your markdown files into live, interactive documentation with executable component demos. You write markdown, and Docfy generates Ember routes, components, and data structures automatically.

````md
# Button Component

Our primary button component supports multiple variants.

```gjs preview
import Component from '@glimmer/component';
import { Button } from '@frontile/buttons';

export default class ButtonDemo extends Component {
  // Component logic here

  <template>
    <Button @variant="primary" @size="large">
      Click me!
    </Button>
  </template>
}
```
````

This becomes a live, interactive demo in your documentation site.

## Choose Your Build System

Docfy's modular architecture supports different Ember build systems:

### Classic Ember CLI → [@docfy/ember-cli](./ember-cli.md)

Perfect for traditional Ember applications. Processes markdown during the Ember CLI build phase with full prember support for static site generation.

### Modern Vite Builds → [@docfy/ember-vite](./ember-vite.md)

Built for `@embroider/vite`. Offers lightning-fast development builds with hot module replacement for instant markdown updates.

Both integrations use the same runtime components from `@docfy/ember`, ensuring consistent APIs regardless of your build system choice.

## What You Get

- **Live Component Demos** - Write component examples in markdown that become executable demos
- **Smart Navigation** - Auto-generated routing with previous/next page navigation
- **Rich Metadata** - Extract headings, edit links, and custom frontmatter
- **Flexible Styling** - Unstyled components that adapt to your design system
- **TypeScript Support** - Full type safety across all packages

## Next Steps

Ready to add Docfy to your Ember app? Follow our [Tutorial](./tutorial.md) to create your first documentation site.

If you're upgrading from a previous version, check the [Upgrade Guide](./upgrade-guide.md) for detailed instructions.
