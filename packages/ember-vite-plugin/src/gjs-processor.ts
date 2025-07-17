import type { PageContent } from '@docfy/core/lib/types';
import type { 
  ImportStatement, 
  InlineComponent, 
  DemoComponent, 
  PreviewTemplateComponent 
} from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-processor');

/**
 * Process a page's pluginData to extract GJS metadata for file-based components
 * This generates import statements and content modifications for external component files
 */
export function processPageForGJS(page: PageContent, componentImports: string[] = []) {
  debug('Processing page for GJS with file-based components', { url: page.meta.url });
  
  const imports: ImportStatement[] = [];
  let hasContentModifications = false;
  let modifiedContent = page.rendered || '';

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

  // Process preview template components from pluginData for content replacement
  const previewComponents = page.pluginData?.previewComponents as PreviewTemplateComponent[] | undefined;
  if (previewComponents && Array.isArray(previewComponents)) {
    debug('Found preview components for content replacement', { count: previewComponents.length });
    
    previewComponents.forEach(preview => {
      // Replace preview template code blocks with component usage in content
      hasContentModifications = true;
      // Find and replace the code block in the rendered content
      const codeBlockPattern = new RegExp(
        `<pre><code class="language-hbs">[^<]*${escapeRegex(preview.template)}[^<]*</code></pre>`,
        'g'
      );
      modifiedContent = modifiedContent.replace(codeBlockPattern, `<${preview.name} />`);
    });
  }

  debug('Processed page GJS metadata', {
    url: page.meta.url,
    importsCount: imports.length,
    hasContentModifications
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