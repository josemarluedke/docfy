import type { PageContent } from '@docfy/core/lib/types';
import type { 
  ImportStatement, 
  InlineComponent, 
  DemoComponent
} from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-processor');

/**
 * Create DocfyDemo nodes like the original ember plugin
 * This mirrors the createDemoNodes function from the original utils.ts
 */
function createDocfyDemoNodes(component: DemoComponent): string {
  let html = `<DocfyDemo @id="${component.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}" as |demo|>\n`;

  // Add description if available
  if (component.description) {
    html += `  <demo.Description`;
    if (component.description.title) {
      html += ` @title="${component.description.title}"`;
    }
    if (component.description.editUrl) {
      html += ` @editUrl="${component.description.editUrl}"`;
    }
    html += `>\n`;
    // Add description content (markdown rendered)
    if (component.description.content) {
      html += `    ${component.description.content}\n`;
    }
    html += `  </demo.Description>\n`;
  }

  // Add Example with the generated component
  html += `  <demo.Example>\n`;
  html += `    <${component.name} />\n`;
  html += `  </demo.Example>\n`;

  // Add Snippets if there are multiple chunks
  if (component.chunks.length > 1) {
    html += `  <demo.Snippets as |Snippet|>\n`;
    component.chunks.forEach((chunk) => {
      html += `    <Snippet @name="${chunk.type}">\n`;
      html += `      <pre><code class="language-${chunk.ext}">${escapeHtml(chunk.code)}</code></pre>\n`;
      html += `    </Snippet>\n`;
    });
    html += `  </demo.Snippets>\n`;
  } else if (component.chunks.length === 1) {
    // Single snippet
    const chunk = component.chunks[0];
    html += `  <demo.Snippet @name="${chunk.type}">\n`;
    html += `    <pre><code class="language-${chunk.ext}">${escapeHtml(chunk.code)}</code></pre>\n`;
    html += `  </demo.Snippet>\n`;
  }

  html += `</DocfyDemo>\n`;

  return html;
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Process a page's pluginData to extract GJS metadata for file-based components
 * This generates import statements and content modifications for external component files
 */
export function processPageForGJS(page: PageContent, componentImports: string[] = []) {
  debug('Processing page for GJS with file-based components', { url: page.meta.url });
  
  const imports: ImportStatement[] = [];
  let hasContentModifications = false;
  let modifiedContent = page.rendered || '';
  let demoContentToAdd = '';

  // Add component imports (these will be generated as separate files)
  componentImports.forEach(importStatement => {
    // Parse the import statement to extract name and path
    const match = importStatement.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
    if (match) {
      const [, name, path] = match;
      imports.push({
        type: 'component',
        name,
        path,
        isDefault: true
      });
    }
  });

  // Process demo components from pluginData to generate DocfyDemo blocks
  const demoComponents = page.pluginData?.demoComponents as DemoComponent[] | undefined;
  if (demoComponents && Array.isArray(demoComponents)) {
    debug('Found demo components to render', { count: demoComponents.length, demoComponents });
    
    // Check if we have any preview templates (for DocfyDemo import)
    // For now, import DocfyDemo if any demos exist (we'll refine this logic)
    const hasPreviewTemplates = demoComponents.some(demo => {
      return demo.chunks?.[0]?.type === 'preview' || demo.chunks?.[0]?.type === 'preview-template';
    });
    
    // Filter out preview templates to get only regular demo components
    const regularDemos = demoComponents.filter(demo => demo.chunks?.[0]?.type !== 'preview');
    
    // Add DocfyDemo import if we have either preview templates or regular demos
    // TEMPORARY: Always add DocfyDemo import if any demo components exist
    if (demoComponents.length > 0) {
      imports.push({
        type: 'component',
        name: 'DocfyDemo',
        path: 'test-app-vite/components/docfy-demo',
        isDefault: true
      });
    }
    
    // Only add to Examples section if not using manual demo insertion
    const isManualDemoInsertion = page.meta?.frontmatter?.manualDemoInsertion;
    
    if (regularDemos.length > 0 && !isManualDemoInsertion) {
      hasContentModifications = true;
      
      // Create Examples section header if there are regular demo components
      demoContentToAdd = '\n\n<h2>Examples</h2>\n\n';
      
      // Generate DocfyDemo blocks for each regular demo component
      regularDemos.forEach(demo => {
        demoContentToAdd += createDocfyDemoNodes(demo) + '\n\n';
      });
    }
  }

  // Preview templates are now handled as demo components, so no separate processing needed

  // Preview templates are now handled via AST replacement in the preview-templates plugin

  // Add demo content at the end if we have demos
  if (demoContentToAdd) {
    modifiedContent = modifiedContent + demoContentToAdd;
  }

  debug('Processed page GJS metadata', {
    url: page.meta.url,
    importsCount: imports.length,
    hasContentModifications,
    hasDemoComponents: !!demoComponents?.length
  });

  return {
    imports,
    inlineComponents: [], // No longer using inline components
    templateContent: hasContentModifications ? modifiedContent : '', // Only return modified content
    additionalContent: '' // Reserved for future use
  };
}

/**
 * Escape string for use in regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}