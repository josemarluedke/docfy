import type { PageContent } from '@docfy/core/lib/types';
import type {
  ImportStatement,
  InlineComponent,
  DemoComponent
} from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-processor');

/**
 * Process a page's pluginData to extract GJS metadata for file-based components
 * This generates import statements and content modifications for external component files
 */
export function processPageForGJS(
  page: PageContent,
  componentImports: string[] = []
) {
  debug('Processing Page Template file-based components', {
    url: page.meta.url
  });

  const imports: ImportStatement[] = [];
  let hasContentModifications = false;
  let modifiedContent = page.rendered || '';
  let demoContentToAdd = '';

  // Add component imports (these will be generated as separate files)
  componentImports.forEach((importStatement) => {
    // Parse the import statement to extract name and path
    const match = importStatement.match(
      /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/
    );
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
  const demoComponents = page.pluginData?.demoComponents as
    | DemoComponent[]
    | undefined;

  // Debug: Check what demo component chunks actually contain
  if (
    demoComponents &&
    Array.isArray(demoComponents) &&
    page.meta.url.includes('docfy-previous-and-next-page')
  ) {
    console.log(
      'DEBUG-DEMO-CHUNKS:',
      JSON.stringify(demoComponents[0], null, 2)
    );
  }

  if (
    demoComponents &&
    Array.isArray(demoComponents) &&
    demoComponents.length > 0
  ) {
    debug('Found demo components to render', {
      count: demoComponents.length,
      demoComponents
    });

    // Check if we have any preview templates (for DocfyDemo import)
    // For now, import DocfyDemo if any demos exist (we'll refine this logic)
    const hasPreviewTemplates = demoComponents.some((demo) => {
      return (
        demo.chunks?.[0]?.type === 'preview' ||
        demo.chunks?.[0]?.type === 'preview-template'
      );
    });

    // Filter out preview templates to get only regular demo components
    const regularDemos = demoComponents.filter(
      (demo) => demo.chunks?.[0]?.type !== 'preview'
    );

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
      regularDemos.forEach((demo) => {
        // Note: We're not using createDocfyDemoNodes here since it returns Node[] for AST processing
        // Instead we'll let the demo-components plugin handle this via AST manipulation
        const demoId = demo.name.dashCase;
        demoContentToAdd += `<DocfyDemo @id="${demoId}" as |demo|>\n`;
        demoContentToAdd += `<demo.Example><${demo.name.pascalCase} /></demo.Example>\n`;
        demoContentToAdd += `</DocfyDemo>\n\n`;
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
