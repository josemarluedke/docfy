import type { PageContent } from '@docfy/core/lib/types';
import type { ImportStatement, FileToGenerate, PluginData } from './types.js';
import { generateComponentFiles } from './component-generator.js';
import { getComponentImport } from './import-map.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:template-generator');

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
 * Combines component generation, plugin imports, and frontmatter imports
 * Returns the complete imports string ready for template generation
 */
function processPageImports(page: PageContent): string {
  debug('Processing page imports', { url: page.meta.url });

  const structuredImports: ImportStatement[] = [];
  const pluginData = page.pluginData as PluginData | undefined;
  const demoComponents = pluginData?.demoComponents;

  // Generate imports for demo components
  if (demoComponents?.length) {
    demoComponents.forEach(demo => {
      // For GJS/GTS files, import directly; otherwise import the JS file
      const gtsGjsChunk = demo.chunks.find(c => ['gjs', 'gts'].includes(c.ext));

      let ext = 'js'; // default to JS import
      if (gtsGjsChunk) {
        ext = gtsGjsChunk.ext; // Use GJS/GTS file directly
      }

      const componentPath = getComponentImportPath(page.meta.url, demo.name.dashCase, ext);

      structuredImports.push({
        name: demo.name.pascalCase,
        path: componentPath,
        isDefault: true,
      });
    });

    // Add DocfyDemo import if we have demo components
    structuredImports.push(getComponentImport('DocfyDemo'));
  }

  // Process plugin imports (e.g., from replace-internal-links-with-docfy-link plugin)
  if (pluginData?.imports?.length) {
    pluginData.imports.forEach((imp: ImportStatement) => {
      structuredImports.push({
        name: imp.name,
        path: imp.path,
        isDefault: imp.isDefault ?? true,
        namedImports: imp.namedImports,
      });
    });
  }

  // Generate structured imports section
  const structuredImportsSection =
    structuredImports.length > 0
      ? structuredImports.map(imp => generateImportStatement(imp)).join('\n')
      : '';

  // Handle raw imports from frontmatter
  const frontmatterImports = page.meta.frontmatter.imports;
  let rawImportsSection = '';

  if (frontmatterImports) {
    if (typeof frontmatterImports === 'string') {
      // Single import string
      rawImportsSection = frontmatterImports;
    } else if (Array.isArray(frontmatterImports)) {
      // Array of import strings
      rawImportsSection = frontmatterImports
        .filter((imp): imp is string => typeof imp === 'string')
        .join('\n');
    }
  }

  // Combine all imports into final string
  const allImportsSections = [structuredImportsSection, rawImportsSection].filter(
    section => section.length > 0
  );

  const finalImportsString =
    allImportsSections.length > 0 ? allImportsSections.join('\n') + '\n\n' : '';

  debug('Processed page imports', {
    url: page.meta.url,
    imports: finalImportsString,
  });

  return finalImportsString;
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
    return `import { ${importStmt.namedImports.join(', ')} } from '${importStmt.path}';`;
  } else {
    // Single named import: import { name } from 'path'
    return `import { ${importStmt.name} } from '${importStmt.path}';`;
  }
}

/**
 * Generate a complete page template with path and content
 * This is the main entry point for template generation
 */
export function generatePage(page: PageContent): FileToGenerate[] {
  debug('Generating page files', { url: page.meta.url });

  const filesToGenerate: FileToGenerate[] = [];

  // Generate the template path
  const templatePath = generateTemplatePath(page.meta.url);

  // Generate component files for the page
  const componentFiles = generateComponentFiles(page);

  // Process and generate all import statements
  const importsSection = processPageImports(page);

  const template = `${importsSection}<template>
  ${page.rendered}
</template>`;

  // Add template file to the list
  filesToGenerate.push({
    path: templatePath,
    content: template,
  });

  // Add all component files to the list
  filesToGenerate.push(...componentFiles);

  debug('Generated page files', {
    url: page.meta.url,
    totalFiles: filesToGenerate.length,
    templatePath,
    componentFilesCount: componentFiles.length,
    importsStringLength: importsSection.length,
  });

  return filesToGenerate;
}
