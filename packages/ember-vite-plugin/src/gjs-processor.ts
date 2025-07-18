import type { PageContent } from '@docfy/core/lib/types';
import type { ImportStatement, DemoComponent } from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:gjs-processor');

export function processImportsFromPage(
  page: PageContent,
  componentImports: string[] = []
) {
  debug('Processing Page Template file-based components', {
    url: page.meta.url
  });

  const imports: ImportStatement[] = [];

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

  const demoComponents = page.pluginData?.demoComponents as
    | DemoComponent[]
    | undefined;

  if (
    demoComponents &&
    Array.isArray(demoComponents) &&
    demoComponents.length > 0
  ) {
    // Add DocfyDemo import if we have either preview templates or regular demos
    if (demoComponents.length > 0) {
      imports.push({
        type: 'component',
        name: 'DocfyDemo',
        path: 'test-app-vite/components/docfy-demo',
        isDefault: true
      });
    }
  }

  debug('Processed page GJS metadata', {
    url: page.meta.url,
    imports: imports
  });

  return {
    imports
  };
}
