import type { PluginContext } from 'rollup';
import type Docfy from '@docfy/core';
import type { DocfyConfig, PageContent, SourceConfig } from '@docfy/core/lib/types';
import path from 'path';
import { toPascalCase, toDashCase } from './utils.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-generator');

interface ComponentImport {
  name: string;
  path: string;
}

/**
 * Extract component imports from rendered HTML
 * This function analyzes the HTML to find any component usage and generates appropriate import statements
 */
function extractComponentImports(html: string): ComponentImport[] {
  const imports: ComponentImport[] = [];
  
  // Common patterns for component usage in HTML
  // This is a basic implementation - you might want to extend this based on your specific needs
  
  // Look for custom elements that might be components (PascalCase tags)
  const componentRegex = /<([A-Z][a-zA-Z0-9]*(?::[a-zA-Z0-9]+)*)/g;
  const matches = html.matchAll(componentRegex);
  
  for (const match of matches) {
    const tagName = match[1];
    
    // Skip known HTML elements that happen to be capitalized
    if (!['HTML', 'HEAD', 'BODY', 'DIV', 'SPAN', 'P', 'A', 'IMG', 'BR', 'HR'].includes(tagName)) {
      // Convert PascalCase to kebab-case for component path
      const componentPath = `../components/${toDashCase(tagName)}`;
      
      // Only add if not already present
      if (!imports.some(imp => imp.name === tagName)) {
        imports.push({
          name: tagName,
          path: componentPath
        });
      }
    }
  }
  
  return imports;
}

export interface DemoComponent {
  name: {
    pascalCase: string;
    dashCase: string;
  };
  chunks: Array<{
    ext: string;
    code: string;
  }>;
}

export function generateGJSTemplate(page: PageContent): string {
  debug('Generating GJS template for page', { url: page.meta.url });

  const className = toPascalCase(page.meta.title || path.basename(page.source, '.md'));
  
  return `
import Component from '@glimmer/component';

export default class ${className} extends Component {
  <template>
    <div class="docfy-page">
      {{{${JSON.stringify(page.rendered)}}}}
    </div>
  </template>
}
`;
}

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
export function generatePageTemplate(page: PageContent): string {
  debug('Generating GJS page template for route', { url: page.meta.url });
  
  // Extract any component usage from the rendered HTML to generate imports
  const imports = extractComponentImports(page.rendered);
  
  const importStatements = imports.length > 0 
    ? imports.map(imp => `import ${imp.name} from '${imp.path}';`).join('\n') + '\n\n'
    : '';
  
  return `${importStatements}<template>
  ${page.rendered}
</template>`;
}

export async function generateGJSComponents(
  context: PluginContext,
  docfyInstance: Docfy,
  config: DocfyConfig
): Promise<void> {
  debug('Generating GJS components for build');

  // Run Docfy to get all processed content
  const sources: SourceConfig[] = (config.sources || []).map(source => ({
    ...source,
    root: source.root || process.cwd()
  }));
  
  try {
    const result = await docfyInstance.run(sources);
    
    result.content.forEach(page => {
      // Generate route template for each markdown page
      // This mirrors the existing Ember CLI behavior where templates are generated
      // in the templates/ directory following the URL structure
      const templatePath = generateTemplatePath(page.meta.url);
      const pageTemplate = generatePageTemplate(page);
      
      debug('Generating route template', { 
        url: page.meta.url, 
        templatePath,
        hasContent: !!page.rendered
      });
      
      context.emitFile({
        type: 'asset',
        fileName: templatePath,
        source: pageTemplate
      });

      // Generate demo components
      const demoComponents = extractDemoComponents(page);
      demoComponents.forEach(component => {
        const componentGJS = generateDemoComponentGJS(component);
        const componentFileName = `components/${component.name.dashCase}.gjs`;
        
        debug('Generating demo component', { 
          name: component.name.dashCase, 
          fileName: componentFileName
        });
        
        context.emitFile({
          type: 'asset',
          fileName: componentFileName,
          source: componentGJS
        });
      });
    });
  } catch (error) {
    debug('Error generating GJS components', { error });
    throw error;
  }
}

function extractDemoComponents(page: PageContent): DemoComponent[] {
  const demoComponents: DemoComponent[] = [];
  
  // Check if the page has demo components in its plugin data
  const pluginDemoComponents = page.pluginData?.demoComponents;
  if (Array.isArray(pluginDemoComponents)) {
    pluginDemoComponents.forEach((component: any) => {
      if (component.name && component.chunks) {
        demoComponents.push({
          name: {
            pascalCase: toPascalCase(component.name),
            dashCase: toDashCase(component.name)
          },
          chunks: component.chunks
        });
      }
    });
  }

  debug('Extracted demo components', { 
    pageUrl: page.meta.url, 
    componentCount: demoComponents.length 
  });

  return demoComponents;
}

function generateDemoComponentGJS(component: DemoComponent): string {
  debug('Generating GJS for demo component', { name: component.name.dashCase });

  // Find the template chunk
  const templateChunk = component.chunks.find(chunk => 
    chunk.ext === 'hbs' || chunk.ext === 'html'
  );

  // Find the JavaScript/TypeScript chunk
  const jsChunk = component.chunks.find(chunk => 
    ['js', 'ts', 'gjs', 'gts'].includes(chunk.ext)
  );

  if (templateChunk && jsChunk) {
    // Component has both template and logic
    return generateGJSWithSeparateTemplate(component, templateChunk, jsChunk);
  } else if (templateChunk) {
    // Template-only component
    return generateTemplateOnlyGJS(component, templateChunk);
  } else if (jsChunk) {
    // JavaScript-only component (might already be GJS)
    return generateJSOnlyGJS(component, jsChunk);
  }

  // Fallback: empty component
  return generateEmptyGJS(component);
}

function generateGJSWithSeparateTemplate(
  component: DemoComponent,
  templateChunk: { code: string },
  jsChunk: { code: string }
): string {
  // Use setComponentTemplate pattern for components with separate template and JS
  return `
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

${jsChunk.code}

// Set the template for the component
setComponentTemplate(hbs\`${templateChunk.code}\`, ${component.name.pascalCase});

export default ${component.name.pascalCase};
`;
}

function generateTemplateOnlyGJS(
  component: DemoComponent,
  templateChunk: { code: string }
): string {
  // Use modern <template> syntax for template-only components
  return `
import Component from '@glimmer/component';

export default class ${component.name.pascalCase} extends Component {
  <template>
    ${templateChunk.code}
  </template>
}
`;
}

function generateJSOnlyGJS(
  component: DemoComponent,
  jsChunk: { code: string }
): string {
  // If it's already GJS/GTS, return as-is
  if (jsChunk.code.includes('<template>')) {
    return jsChunk.code;
  }

  // Otherwise, wrap with template-only component
  return `
import Component from '@glimmer/component';

${jsChunk.code}

export default class ${component.name.pascalCase} extends Component {
  <template>
    <div class="demo-component">
      <!-- Component logic defined above -->
    </div>
  </template>
}
`;
}

function generateEmptyGJS(component: DemoComponent): string {
  return `
import Component from '@glimmer/component';

export default class ${component.name.pascalCase} extends Component {
  <template>
    <div class="demo-component demo-component--empty">
      <!-- ${component.name.dashCase} -->
    </div>
  </template>
}
`;
}

function hasBackingJS(chunks: Array<{ ext: string }>): boolean {
  return chunks.some(chunk => ['js', 'ts', 'gts', 'gjs'].includes(chunk.ext));
}