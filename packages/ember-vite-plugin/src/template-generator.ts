import type { PluginContext } from 'rollup';
import type { PageContent } from '@docfy/core/lib/types';
import type { ImportStatement, DemoComponent } from './types.js';
import { generateComponentFiles } from './component-generator.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:template-generator');

export interface PageResult {
  path: string;
  content: string;
}

/**
 * Generate the template path for a markdown page URL
 * This mirrors the existing Ember CLI behavior from DocfyBroccoli.build()
 * Templates should be in app/templates/ for Ember to find them
 */
function generateTemplatePath(url: string): string {
  const parts = ['app', 'templates', ...url.split('/').filter(Boolean)];

  // Handle index routes - if URL ends with '/', add 'index'
  if (url.endsWith('/')) {
    parts.push('index');
  }

  return `${parts.join('/')}.gjs`;
}

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
 * Process all imports for a page template
 * Combines component generation and import processing
 */
function processPageImports(page: PageContent): ImportStatement[] {
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

/**
 * Generate an import statement from ImportStatement metadata
 */
function generateImportStatement(importStmt: ImportStatement): string {
  if (importStmt.isDefault && importStmt.namedImports) {
    // Mixed import: import Default, { named1, named2 } from 'path'
    return `import ${importStmt.name}, { ${importStmt.namedImports.join(
      ', '
    )} } from '${importStmt.path}';`;
  } else if (importStmt.isDefault) {
    // Default import: import Default from 'path'
    return `import ${importStmt.name} from '${importStmt.path}';`;
  } else if (importStmt.namedImports) {
    // Named imports: import { named1, named2 } from 'path'
    return `import { ${importStmt.namedImports.join(', ')} } from '${
      importStmt.path
    }';`;
  } else {
    // Single named import: import { name } from 'path'
    return `import { ${importStmt.name} } from '${importStmt.path}';`;
  }
}

/**
 * Generate a complete page template with path and content
 * This is the main entry point for template generation
 */
export function generatePage(
  page: PageContent,
  pluginCtx: PluginContext
): PageResult {
  debug('Generating page template and path', { url: page.meta.url });

  // Generate the template path
  const templatePath = generateTemplatePath(page.meta.url);

  // Generate component files for the page
  generateComponentFiles(pluginCtx, page);

  // Process and generate import statements
  const imports = processPageImports(page);

  const importsSection =
    imports.length > 0
      ? imports.map((imp) => generateImportStatement(imp)).join('\n') + '\n\n'
      : '';

  const template = `${importsSection}
<template>
  ${page.rendered}
</template>`;

  debug('Generated page', {
    url: page.meta.url,
    path: templatePath,
    importsCount: imports.length
  });

  return {
    path: templatePath,
    content: template
  };
}

