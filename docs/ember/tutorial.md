---
order: 2
title: Tutorial
---

# Tutorial

Let's create your first Docfy documentation site! This guide walks you through setting up a new Ember app with Docfy, but you can also add Docfy to an existing application.

## Create a New Ember App

```bash
ember new my-docs-site
cd my-docs-site
```

Remove the `<WelcomePage />` from `app/templates/application.hbs` if present.

## Install Docfy

Choose your build integration and install both packages:

**For Classic Ember CLI:**
```bash
npm install --save-dev @docfy/ember-cli
npm install @docfy/ember
```

**For Vite Builds:**
```bash
npm install --save-dev @docfy/ember-vite  
npm install @docfy/ember
```

## Configure Your Build

### Ember CLI Configuration

Create `.docfy-config.js` in your project root:

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

### Vite Configuration

Add the plugin to your `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import { docfyVite } from '@docfy/ember-vite';

export default defineConfig({
  plugins: [
    // ... other plugins
    docfyVite({
      sources: [
        {
          root: path.resolve(__dirname, 'docs'),
          pattern: '**/*.md',
          urlPrefix: 'docs',
        },
      ],
    }),
  ],
});
```

## Add Routes

Update your `app/router.js` to include Docfy routes:

```js
import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { addDocfyRoutes } from '@docfy/ember';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  addDocfyRoutes(this);
});
```

## Create Your First Docs

Create a `docs` folder in your project root and add `docs/index.md`:

```md
---
title: Welcome
---

# Welcome to My Documentation

This is my first Docfy documentation site! 

## Getting Started

You can create more pages by adding markdown files to the `docs` folder.
```

Add another page at `docs/installation.md`:

```md
---
title: Installation  
---

# Installation

Follow these steps to install the project:

1. Clone the repository
2. Run `npm install`
3. Start the development server with `npm start`
```

## Build Navigation

Create `app/templates/docs.hbs` to add a sidebar:

```hbs
<div class="docs-layout">
  <aside class="sidebar">
    <DocfyOutput @scope="docs" as |node|>
      <nav>
        {{#each node.pages as |page|}}
          <DocfyLink @to={{page.url}} class="nav-link">
            {{page.title}}
          </DocfyLink>
        {{/each}}
      </nav>
    </DocfyOutput>
  </aside>

  <main class="content">
    {{outlet}}
    
    <DocfyPreviousAndNextPage as |previous next|>
      <div class="page-nav">
        {{#if previous}}
          <DocfyLink @to={{previous.url}} class="prev-link">
            ← {{previous.title}}
          </DocfyLink>
        {{/if}}
        {{#if next}}
          <DocfyLink @to={{next.url}} class="next-link">
            {{next.title}} →
          </DocfyLink>
        {{/if}}
      </div>
    </DocfyPreviousAndNextPage>
  </main>
</div>
```

## Start Your Server

```bash
ember serve
```

Visit `http://localhost:4200/docs` to see your documentation site!

## Next Steps

Now that you have a basic documentation site running:

- Learn about [Writing Demos](./writing-demos.md) to create interactive component examples
- Explore the [DocfyOutput component](./components/docfy-output.md) for advanced navigation
- Check out specific build integration guides for [Ember CLI](./ember-cli.md) or [Vite](./ember-vite.md)

Your documentation site will grow as you add more markdown files to the `docs` folder. Each file becomes a page with automatic routing and navigation.