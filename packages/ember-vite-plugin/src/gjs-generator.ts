import type { PluginContext } from 'rollup';
import type { PageContent } from '@docfy/core/lib/types';
import type { ImportStatement } from './types.js';
import { processImportsFromPage } from './gjs-processor.js';
import {
  generateComponentFiles,
  getComponentImports
} from './component-generator.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-generator');

/**
 * Generate the template path for a markdown page URL
 * This mirrors the existing Ember CLI behavior from DocfyBroccoli.build()
 * Templates should be in app/templates/ for Ember to find them
 */
export function generateTemplatePath(url: string): string {
  const parts = ['app', 'templates', ...url.split('/').filter(Boolean)];

  // Handle index routes - if URL ends with '/', add 'index'
  if (url.endsWith('/')) {
    parts.push('index');
  }

  return `${parts.join('/')}.gjs`;
}

/**
 * Generate a GJS template for a markdown page
 * This ensures compatibility with Ember's template resolution
 */
export function generatePageTemplate(
  page: PageContent,
  ctx?: PluginContext
): string {
  debug('Generating GJS page template for route', { url: page.meta.url });

  // detectAndAddPreviewTemplates(page);

  // Generate separate component files if needed
  let componentImports: string[] = [];
  if (ctx) {
    const generatedFiles = generateComponentFiles(ctx, page);
    componentImports = getComponentImports(page, generatedFiles);
  }

  // Process page using the new file-based approach
  const gjsMetadata = processImportsFromPage(page, componentImports);

  // Use modified content if available, otherwise fall back to original rendered content
  const templateContent = page.rendered || '';

  // Generate the complete GJS template
  return generateGJSTemplate(gjsMetadata, templateContent);
}

/**
 * Generate a complete GJS template with proper structure
 */
function generateGJSTemplate(
  gjsMetadata: { imports: ImportStatement[] },
  templateContent: string
): string {
  const importsSection =
    gjsMetadata.imports.length > 0
      ? gjsMetadata.imports
          .map((imp) => generateImportStatement(imp))
          .join('\n') + '\n\n'
      : '';

  const template = `${importsSection}
<template>
  ${templateContent}
</template>`;

  return template;
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
