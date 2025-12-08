---
order: 3
title: Routing
---

# Routing

Docfy provides powerful routing utilities that automatically generate routes from your markdown files. This guide covers how to set up and customize routing for your documentation site.

## Basic Setup

The simplest way to add Docfy routes to your application is using the `addDocfyRoutes` function. This generates routes for all your markdown files automatically.

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

This automatically creates routes for all markdown files in your configured sources. For example, if you have:

```
docs/
  index.md
  getting-started.md
  api/
    components.md
    utilities.md
```

Docfy will generate these routes:
- `/docs`
- `/docs/getting-started`
- `/docs/api/components`
- `/docs/api/utilities`

## Scoped Routes

For larger documentation sites, you may want to organize your docs into multiple sections and create separate route hierarchies for each section. This is where `addDocfyScopedRoutes` becomes useful.

### What are Scoped Routes?

Scoped routes allow you to filter the generated routes to a specific section of your documentation. This is particularly useful when you want to:

- Create separate navigation for different sections
- Build multi-tenant documentation (e.g., "core" docs vs "ember" docs)
- Have different layouts for different documentation sections
- Filter sidebar navigation based on the current section

### Basic Scoped Routing

```js
import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { addDocfyScopedRoutes } from '@docfy/ember';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('docs', function() {
    this.route('core', function() {
      addDocfyScopedRoutes(this, 'docs/core');
    });

    this.route('ember', function() {
      addDocfyScopedRoutes(this, 'docs/ember');
    });
  });
});
```

With this setup and the following file structure:

```
docs/
  core/
    index.md
    getting-started.md
    configuration.md
  ember/
    index.md
    tutorial.md
    components.md
```

You'll get these routes:
- `/docs/core` → `docs/core/index.md`
- `/docs/core/getting-started` → `docs/core/getting-started.md`
- `/docs/core/configuration` → `docs/core/configuration.md`
- `/docs/ember` → `docs/ember/index.md`
- `/docs/ember/tutorial` → `docs/ember/tutorial.md`
- `/docs/ember/components` → `docs/ember/components.md`

### API Reference

#### `addDocfyScopedRoutes(context, scope, options?)`

**Parameters:**

- `context` (RouterDSL) - The router context, typically `this` inside `Router.map()`
- `scope` (string) - The path to the documentation section, relative to your configured sources
- `options` (optional object)
  - `nested` (NestedPageMetadata) - Custom nested structure to use instead of the default global structure

**Example with nested scope:**

```js
Router.map(function () {
  this.route('docs', function() {
    this.route('guides', function() {
      this.route('advanced', function() {
        // Only add routes from docs/guides/advanced
        addDocfyScopedRoutes(this, 'docs/guides/advanced');
      });
    });
  });
});
```

### Working with Scoped Navigation

When using scoped routes, you'll often want to filter your sidebar navigation to show only the current section. Here's how to do that:

```hbs
{{! app/templates/docs/core.hbs }}
<div class="docs-layout">
  <aside class="sidebar">
    <DocfyOutput @scope="docs/core" as |node|>
      <nav>
        {{#each node.pages as |page|}}
          <DocfyLink @to={{page.url}}>
            {{page.title}}
          </DocfyLink>
        {{/each}}

        {{#each node.children as |child|}}
          <div class="nav-section">
            <h3>{{child.label}}</h3>
            {{#each child.pages as |page|}}
              <DocfyLink @to={{page.url}}>
                {{page.title}}
              </DocfyLink>
            {{/each}}
          </div>
        {{/each}}
      </nav>
    </DocfyOutput>
  </aside>

  <main class="content">
    {{outlet}}
  </main>
</div>
```

The `@scope` parameter on `DocfyOutput` filters the navigation tree to only show pages within that scope.

### Dynamic Section Detection

For a more flexible approach that doesn't require manually defining routes for each section, you can use dynamic section detection from the URL:

```js
// app/utils/extract-section.ts
export interface SectionExtractionConfig {
  basePath: string;
  segmentIndex?: number;
}

export function extractSectionFromUrl(
  url: string,
  config: SectionExtractionConfig
): string | undefined {
  const { basePath, segmentIndex = 0 } = config;
  const normalizedUrl = url.replace(/\/$/, '');
  const normalizedBasePath = basePath.replace(/\/$/, '');

  if (!normalizedUrl.startsWith(normalizedBasePath)) {
    return undefined;
  }

  const remainingPath = normalizedUrl.slice(normalizedBasePath.length);
  const segments = remainingPath.split('/').filter((segment) => segment !== '');

  return segments[segmentIndex];
}
```

Then use it in your component:

```gts
// app/components/docs-layout.gts
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import { extractSectionFromUrl } from '../utils/extract-section';
import type RouterService from '@ember/routing/router-service';
import type DocfyService from '@docfy/ember/services/docfy';

interface DocsLayoutSignature {
  Args: {
    sectionBasePath?: string;
    sectionSegmentIndex?: number;
  };
}

export default class DocsLayout extends Component<DocsLayoutSignature> {
  @service declare router: RouterService;
  @service declare docfy: DocfyService;

  @cached
  get currentSection(): string | undefined {
    const currentURL = this.router.currentURL;
    if (!currentURL) {
      return undefined;
    }

    return extractSectionFromUrl(currentURL, {
      basePath: this.args.sectionBasePath || '/docs',
      segmentIndex: this.args.sectionSegmentIndex ?? 0,
    });
  }

  get filteredNode() {
    if (this.currentSection) {
      return this.docfy.findNestedChildrenByName(
        `docs/${this.currentSection}`
      );
    }
    return this.docfy.nested;
  }
}
```

This approach allows you to use the simple `addDocfyRoutes(this)` while still getting section-specific navigation that automatically adapts to the current URL.

## Route Customization

### Custom Route Names

If you need to customize route names, you can nest `addDocfyRoutes` or `addDocfyScopedRoutes` under custom route names:

```js
Router.map(function () {
  this.route('documentation', { path: '/docs' }, function() {
    addDocfyRoutes(this);
  });
});
```

### Multiple Documentation Sources

You can have multiple independent documentation sections:

```js
Router.map(function () {
  this.route('docs', function() {
    addDocfyScopedRoutes(this, 'docs');
  });

  this.route('guides', function() {
    addDocfyScopedRoutes(this, 'guides');
  });

  this.route('api', function() {
    addDocfyScopedRoutes(this, 'api-docs');
  });
});
```

## Best Practices

1. **Use `addDocfyRoutes` for simple sites** - If you have a single documentation section, the basic setup is sufficient
2. **Use `addDocfyScopedRoutes` for multi-section sites** - When you need different navigation or layouts for different sections
3. **Consider dynamic section detection** - For more maintainable code when you have many sections
4. **Leverage the `@scope` parameter** - Use it with `DocfyOutput` to filter navigation to the current section
5. **Keep scopes aligned with your file structure** - The scope parameter should match your actual folder structure for predictable routing

## Troubleshooting

### Routes not generating

If routes aren't being generated, check:
1. Your `.docfy-config.js` (Ember CLI) or `vite.config.mjs` (Vite) is properly configured
2. The markdown files are in the correct location
3. The `urlPrefix` in your config matches your route structure

### Scoped routes not found

When using `addDocfyScopedRoutes`, ensure:
1. The scope path matches your actual folder structure
2. The scope is relative to your configured `root` directory
3. There are markdown files in the specified scope

### Navigation not filtering

If `DocfyOutput` isn't filtering correctly:
1. Verify the `@scope` parameter matches your folder structure exactly
2. Check that you're using forward slashes (`/`) in the scope path
3. Ensure the scope doesn't have leading or trailing slashes
