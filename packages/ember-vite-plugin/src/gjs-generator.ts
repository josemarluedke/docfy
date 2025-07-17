import type { PluginContext } from 'rollup';
import type Docfy from '@docfy/core';
import type { DocfyConfig, PageContent, SourceConfig } from '@docfy/core/lib/types';
import type { ImportStatement, InlineComponent } from './types.js';
import path from 'path';
import { toPascalCase, toDashCase } from './utils.js';
import { processPageForGJS } from './gjs-processor.js';
import { generateComponentFiles, getComponentImports } from './component-generator.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-generator');

/**
 * Clean up rendered content to remove excessive empty lines and whitespace
 * This function addresses issues where the rendered HTML contains thousands of empty lines
 */
function cleanUpRenderedContent(rendered: string): string {
  if (!rendered || typeof rendered !== 'string') {
    return '';
  }
  
  // Remove excessive empty lines (more than 2 consecutive empty lines becomes 2)
  let cleaned = rendered.replace(/\n\s*\n\s*\n(\s*\n)*/g, '\n\n');
  
  // Remove leading and trailing whitespace
  cleaned = cleaned.trim();
  
  // Remove any excessive whitespace at the beginning or end of lines
  cleaned = cleaned.replace(/^[ \t]+|[ \t]+$/gm, '');
  
  // Ensure we don't have more than 2 consecutive empty lines anywhere
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}


// DemoComponent interface moved to types.ts

// Old generateGJSTemplate function removed - replaced by enhanced architecture

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
 * Generate a GJS template for a markdown page
 * This ensures compatibility with Ember's template resolution
 */
export function generatePageTemplate(
  page: PageContent, 
  ctx?: PluginContext
): string {
  debug('Generating GJS page template for route', { url: page.meta.url });
  
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
  const cleanTemplateContent = cleanUpRenderedContent(templateContent);
  
  // Generate the complete GJS template
  return generateGJSTemplate(gjsMetadata, cleanTemplateContent);
}

/**
 * Generate a complete GJS template with proper structure
 */
function generateGJSTemplate(gjsMetadata: any, templateContent: string): string {
  
  // Generate import statements
  const importsSection = gjsMetadata.imports.length > 0 
    ? gjsMetadata.imports.map(imp => generateImportStatement(imp)).join('\n') + '\n\n'
    : '';
  
  // Generate inline components
  const inlineComponentsSection = gjsMetadata.inlineComponents.length > 0
    ? gjsMetadata.inlineComponents.map(comp => generateInlineComponentDefinition(comp)).join('\n\n') + '\n\n'
    : '';
  
  // Generate additional content
  const additionalContentSection = gjsMetadata.additionalContent 
    ? gjsMetadata.additionalContent + '\n\n'
    : '';
  
  // Combine all sections
  const template = `${importsSection}${inlineComponentsSection}${additionalContentSection}<template>
  ${templateContent}
</template>`;

  debug('Generated GJS template', {
    importsCount: gjsMetadata.imports.length,
    inlineComponentsCount: gjsMetadata.inlineComponents.length,
    hasAdditionalContent: gjsMetadata.additionalContent.length > 0
  });

  return template;
}

/**
 * Generate an import statement from ImportStatement metadata
 */
function generateImportStatement(importStmt: ImportStatement): string {
  if (importStmt.isDefault && importStmt.namedImports) {
    // Mixed import: import Default, { named1, named2 } from 'path'
    return `import ${importStmt.name}, { ${importStmt.namedImports.join(', ')} } from '${importStmt.path}';`;
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
 * Generate an inline component definition
 */
function generateInlineComponentDefinition(component: InlineComponent): string {
  switch (component.type) {
    case 'const-template':
      return `const ${component.name} = <template>
  ${component.template}
</template>;`;
    
    case 'template-only':
      return `const ${component.name} = <template>
  ${component.template}
</template>;`;
    
    case 'class-based':
      return generateClassBasedComponent(component);
    
    default:
      return `const ${component.name} = <template>
  ${component.template}
</template>;`;
  }
}

/**
 * Generate a class-based component with both template and logic
 */
function generateClassBasedComponent(component: InlineComponent): string {
  if (!component.script) {
    // Fallback to template-only if no script
    return `const ${component.name} = <template>
  ${component.template}
</template>;`;
  }

  // Extract class content from script
  const classMatch = component.script.match(/export\s+default\s+class\s+\w+\s+extends\s+Component\s*\{([\s\S]*)\}/);
  
  if (classMatch) {
    const classBody = classMatch[1].trim();
    
    // Use the const template + class pattern for compatibility
    return `const ${component.name} = <template>
  ${component.template}
</template>;

// Component logic for ${component.name}
class ${component.name}Class extends Component {
  ${classBody}
}

// Apply the logic to the template component
Object.assign(${component.name}, ${component.name}Class.prototype);`;
  } else {
    // Fallback if we can't parse the class
    return `const ${component.name} = <template>
  ${component.template}
</template>;

// Component logic
${component.script}`;
  }
}

// Old generateGJSComponents function removed - demo components are now handled inline