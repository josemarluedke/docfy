import type { PluginContext } from 'rollup';
import type Docfy from '@docfy/core';
import type { DocfyConfig, PageContent, SourceConfig } from '@docfy/core/lib/types';
import path from 'path';
import { toPascalCase, toDashCase } from './utils.js';
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
 * Generate an inline component definition for use within a GJS template
 */
function generateInlineComponent(component: DemoComponent): string {
  debug('Generating inline component', { name: component.name.dashCase });

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
    return generateInlineComponentWithLogic(component, templateChunk, jsChunk);
  } else if (templateChunk) {
    // Template-only component
    return generateInlineTemplateOnlyComponent(component, templateChunk);
  } else if (jsChunk) {
    // JavaScript-only component (might already be GJS)
    return generateInlineJSOnlyComponent(component, jsChunk);
  }

  // Fallback: empty component
  return generateInlineEmptyComponent(component);
}

function generateInlineComponentWithLogic(
  component: DemoComponent,
  templateChunk: { code: string },
  jsChunk: { code: string }
): string {
  // Parse the JS chunk to extract the class content
  const jsContent = jsChunk.code.trim();
  
  // Extract class body from the JS code
  // This is a simple approach - we'll look for the class declaration and extract its content
  const classMatch = jsContent.match(/export\s+default\s+class\s+\w+\s+extends\s+Component\s*\{([\s\S]*)\}/);
  
  if (classMatch) {
    const classBody = classMatch[1].trim();
    return `const ${component.name.pascalCase} = <template>
  ${templateChunk.code}
</template>;

// Component logic for ${component.name.pascalCase}
class ${component.name.pascalCase}Class extends Component {
  ${classBody}
}

// Apply the logic to the template component
Object.assign(${component.name.pascalCase}, ${component.name.pascalCase}Class.prototype);`;
  } else {
    // If we can't parse the class, fall back to a simpler approach
    return `const ${component.name.pascalCase} = <template>
  ${templateChunk.code}
</template>;

// Component logic
${jsContent}`;
  }
}

function generateInlineTemplateOnlyComponent(
  component: DemoComponent,
  templateChunk: { code: string }
): string {
  return `const ${component.name.pascalCase} = <template>
  ${templateChunk.code}
</template>;`;
}

function generateInlineJSOnlyComponent(
  component: DemoComponent,
  jsChunk: { code: string }
): string {
  // If it's already GJS/GTS, return as-is
  if (jsChunk.code.includes('<template>')) {
    return `const ${component.name.pascalCase} = ${jsChunk.code};`;
  }

  // Otherwise, wrap with template-only component
  return `const ${component.name.pascalCase} = <template>
  <div class="demo-component">
    <!-- Component logic defined above -->
  </div>
</template>;

// Component logic
${jsChunk.code}`;
}

function generateInlineEmptyComponent(component: DemoComponent): string {
  return `const ${component.name.pascalCase} = <template>
  <div class="demo-component demo-component--empty">
    <!-- ${component.name.dashCase} -->
  </div>
</template>;`;
}

/**
 * Generate a GJS template for a markdown page
 * This ensures compatibility with Ember's template resolution
 */
export function generatePageTemplate(page: PageContent): string {
  debug('Generating GJS page template for route', { url: page.meta.url });
  
  // Clean up the rendered content to remove excessive empty lines
  const cleanRendered = cleanUpRenderedContent(page.rendered);
  
  // Extract demo components from the page using our demo processor
  const { processPageDemos } = require('./demo-processor.js');
  const demoComponents = processPageDemos(page);
  
  debug('Found demo components', { url: page.meta.url, count: demoComponents.length });
  
  // Generate inline component definitions
  const inlineComponents = demoComponents.map(component => {
    return generateInlineComponent(component);
  }).join('\n\n');
  
  const componentsSection = inlineComponents ? `${inlineComponents}\n\n` : '';
  
  return `${componentsSection}<template>
  ${cleanRendered}
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
      // Generate demo components only (templates are generated in the main plugin)
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