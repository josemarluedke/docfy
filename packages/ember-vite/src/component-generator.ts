import type { PageContent } from '@docfy/core/lib/types';
import type {
  DemoComponent,
  DemoComponentChunk,
  FileToGenerate
} from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:component-generator');

/**
 * Generate component files for a page with demos or preview templates
 * Returns file descriptions instead of writing files directly
 */
export function generateComponentFiles(page: PageContent): FileToGenerate[] {
  const filesToGenerate: FileToGenerate[] = [];

  // Get demo components from pluginData (preview templates are now included in demoComponents)
  const demoComponents = page.pluginData?.demoComponents as
    | DemoComponent[]
    | undefined;

  if (!demoComponents?.length) {
    return filesToGenerate;
  }

  // Create component folder path based on page URL
  const componentFolderPath = getComponentFolderPath(page.meta.url);

  // Generate demo component files (matching original ember implementation)
  demoComponents.forEach((demo) => {
    const demoFiles = generateDemoComponentFiles(demo, componentFolderPath);
    filesToGenerate.push(...demoFiles);
    debug('Generated demo component files', {
      name: demo.name,
      files: demoFiles.length,
      extensions: demo.chunks.map((c) => c.ext)
    });
  });

  debug('Generated component files for page', {
    url: page.meta.url,
    fileCount: filesToGenerate.length
  });

  return filesToGenerate;
}

/**
 * Get the component folder path for a page
 * e.g., /docs/ember/writing-demos -> app/templates/docs/ember/writing-demos_gen
 */
function getComponentFolderPath(pageUrl: string): string {
  // Remove leading/trailing slashes and convert to component path
  const cleanUrl = pageUrl.replace(/^\/+|\/+$/g, '');
  const parts = cleanUrl.split('/').filter(Boolean);

  // Handle index routes
  if (pageUrl.endsWith('/')) {
    parts.push('index');
  }

  // Add _gen suffix to the last part (page name)
  const lastPart = parts.pop() || 'index';
  parts.push(`${lastPart}_gen`);

  return `app/templates/${parts.join('/')}`;
}

/**
 * Check if a demo component has backing JavaScript/TypeScript
 * (Same logic as original ember implementation)
 */
function hasBackingJS(chunks: DemoComponentChunk[]): boolean {
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (['js', 'ts', 'gts', 'gjs'].includes(chunk.ext)) {
      return true;
    }
  }
  return false;
}

/**
 * Generate component files for a demo component (matching original ember implementation)
 */
function generateDemoComponentFiles(
  demo: DemoComponent,
  componentFolderPath: string
): FileToGenerate[] {
  const filesToGenerate: FileToGenerate[] = [];

  // Generate a file for each chunk
  demo.chunks.forEach((chunk) => {
    const componentPath = `${componentFolderPath}/${demo.name.dashCase}.${chunk.ext}`;

    filesToGenerate.push({
      path: componentPath,
      content: chunk.code
    });
  });

  // For components without backing JS, generate a template-only component class
  if (!hasBackingJS(demo.chunks)) {
    const templateOnlyComponent = `import Component from '@glimmer/component';
export default class extends Component {}
`;
    const componentPath = `${componentFolderPath}/${demo.name.dashCase}.js`;

    filesToGenerate.push({
      path: componentPath,
      content: templateOnlyComponent
    });
  }

  return filesToGenerate;
}
