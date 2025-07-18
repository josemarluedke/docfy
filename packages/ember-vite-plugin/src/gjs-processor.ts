import type { PageContent } from '@docfy/core/lib/types';
import type {
  ImportStatement,
  DemoComponent,
  DemoComponentChunk
} from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-processor');

/**
 * Get the import path for a component relative to the page template
 */
function getComponentImportPath(
  pageUrl: string,
  componentName: string,
  ext: string = 'gjs'
): string {
  // Convert page URL to component path
  const cleanUrl = pageUrl.replace(/^\/+|\/+$/g, '');
  const parts = cleanUrl.split('/').filter(Boolean);

  if (pageUrl.endsWith('/')) {
    parts.push('index');
  }

  // Add _gen suffix to the last part (page name)
  const lastPart = parts.pop() || 'index';

  // Create relative path from template to component
  // templates/docs/ember/writing-demos.gjs -> ./writing-demos_gen/componentname.ext
  return `./${lastPart}_gen/${componentName.toLowerCase()}.${ext}`;
}

/**
 * Unified function to process all imports for a page template
 * Combines component generation and import processing
 */
export function processPageImports(page: PageContent): ImportStatement[] {
  debug('Processing page imports', { url: page.meta.url });

  const imports: ImportStatement[] = [];
  const demoComponents = page.pluginData?.demoComponents as
    | DemoComponent[]
    | undefined;

  // Generate imports for demo components
  if (demoComponents?.length) {
    demoComponents.forEach((demo) => {
      // For GJS/GTS files, import directly; otherwise import the JS file
      const gtsGjsChunk = demo.chunks.find((c) =>
        ['gjs', 'gts'].includes(c.ext)
      );

      let ext = 'js'; // default to JS import
      if (gtsGjsChunk) {
        ext = gtsGjsChunk.ext; // Use GJS/GTS file directly
      }

      const componentPath = getComponentImportPath(
        page.meta.url,
        demo.name.dashCase,
        ext
      );

      imports.push({
        type: 'component',
        name: demo.name.pascalCase,
        path: componentPath,
        isDefault: true
      });
    });

    // Add DocfyDemo import if we have demo components
    imports.push({
      type: 'component',
      name: 'DocfyDemo',
      path: 'test-app-vite/components/docfy-demo',
      isDefault: true
    });
  }

  debug('Processed page imports', {
    url: page.meta.url,
    imports: imports.length
  });

  return imports;
}
