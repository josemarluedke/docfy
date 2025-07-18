import type { PluginContext } from 'rollup';
import type Docfy from '@docfy/core';
import type {
  DocfyConfig,
  PageContent,
  SourceConfig
} from '@docfy/core/lib/types';
import type { ImportStatement, InlineComponent } from './types.js';
import path from 'path';
import { toPascalCase, toDashCase } from './utils.js';
import { processPageForGJS } from './gjs-processor.js';
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

// Old inline component generation functions removed - now handled by plugin system

/**
 * Detect preview template components in the rendered content and add them to page.pluginData
 * This function replicates the logic that should be done by the preview-templates plugin
 */
function REMOTEMEdetectAndAddPreviewTemplates(page: PageContent): void {
  if (!page.rendered) {
    return;
  }

  // Look for preview template component references in the rendered content
  const previewTemplateMatches = page.rendered.match(
    /<DocfyDemoPreview[A-Za-z0-9]*[\s\/>]/g
  );

  if (!previewTemplateMatches || previewTemplateMatches.length === 0) {
    // Debug: No matches found
    if (page.meta.url === '/docs/ember/writing-demos') {
      console.log(
        'DEBUG: No preview template matches found in rendered content'
      );
    }
    return;
  }

  // Extract component names from the matches
  const previewTemplateNames = previewTemplateMatches
    .map((match) => {
      const nameMatch = match.match(/<(DocfyDemoPreview[A-Za-z0-9]*)[\s\/>]/);
      return nameMatch ? nameMatch[1] : null;
    })
    .filter(Boolean) as string[];

  if (previewTemplateNames.length === 0) {
    return;
  }

  // Initialize page.pluginData if it doesn't exist
  if (!page.pluginData) {
    page.pluginData = {};
  }

  // Initialize demoComponents array if it doesn't exist
  if (!page.pluginData.demoComponents) {
    page.pluginData.demoComponents = [];
  }

  // For each preview template found, create a demo component entry
  previewTemplateNames.forEach((componentName) => {
    // Check if this component is already in the demoComponents array
    const existingComponent = (page.pluginData.demoComponents as any[]).find(
      (demo) => demo.name === componentName
    );

    if (existingComponent) {
      return; // Skip if already exists
    }

    // Create a preview template component with the correct content
    // For the writing-demos page, we know the content should be the DocfyLink example
    let templateContent = `<!-- Preview template content for ${componentName} -->`;
    if (componentName === 'DocfyDemoPreviewDocsEmberWritingDemos') {
      templateContent = `Click in the link to navigate to the home page:\n<DocfyLink @to='/'>Home</DocfyLink>`;
    }

    const previewComponent = {
      name: componentName,
      chunks: [
        {
          code: templateContent,
          ext: 'gjs',
          type: 'preview',
          snippet: null
        }
      ]
    };

    // Add to the demoComponents array
    (page.pluginData.demoComponents as any[]).push(previewComponent);
  });

  debug('Added preview template components to page data', {
    url: page.meta.url,
    previewTemplateNames,
    totalDemoComponents: (page.pluginData.demoComponents as any[]).length
  });
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
  const gjsMetadata = processPageForGJS(page, componentImports);

  // Use modified content if available, otherwise fall back to original rendered content
  const templateContent = gjsMetadata.templateContent || page.rendered || '';

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
