import type { PluginContext } from 'rollup';
import type { PageContent } from '@docfy/core/lib/types';
import type { DemoComponent, DemoComponentChunk } from './types.js';
import path from 'path';
import fs from 'fs';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:component-generator');

/**
 * Generate component files for a page with demos or preview templates
 * Creates a folder structure: app/components/[page-path]/[component-name].gjs
 */
export function generateComponentFiles(
  pluginCtx: PluginContext,
  page: PageContent
): string[] {
  const generatedFiles: string[] = [];

  // Get demo components from pluginData (preview templates are now included in demoComponents)
  const demoComponents = page.pluginData?.demoComponents as
    | DemoComponent[]
    | undefined;

  if (!demoComponents?.length) {
    return generatedFiles;
  }

  // Create component folder path based on page URL
  const componentFolderPath = getComponentFolderPath(page.meta.url);

  // Generate demo component files (matching original ember implementation)
  if (demoComponents?.length) {
    demoComponents.forEach((demo) => {
      const demoFiles = generateDemoComponentFiles(demo, componentFolderPath);
      generatedFiles.push(...demoFiles);
      debug('Generated demo component files', {
        name: demo.name,
        files: demoFiles.length,
        extensions: demo.chunks.map((c) => c.ext)
      });
    });
  }

  debug('Generated component files for page', {
    url: page.meta.url,
    fileCount: generatedFiles.length
  });

  return generatedFiles;
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
 * This creates separate files for each chunk type (e.g., component.js, component.hbs)
 *
 * TODO: we are using fs directly here, which is not ideal for a Rollup plugin. Investigate how to get away from this and use the Rollup API / Vite APIs instead.
 */
function generateDemoComponentFiles(
  demo: DemoComponent,
  componentFolderPath: string
): string[] {
  const generatedFiles: string[] = [];

  // Generate a file for each chunk
  demo.chunks.forEach((chunk) => {
    const componentPath = `${componentFolderPath}/${demo.name.dashCase}.${chunk.ext}`;
    const fullPath = path.join(process.cwd(), componentPath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write chunk content exactly as authored (no template wrapping)
    fs.writeFileSync(fullPath, chunk.code);
    generatedFiles.push(componentPath);
  });

  // For components without backing JS, generate a template-only component class
  if (!hasBackingJS(demo.chunks)) {
    const templateOnlyComponent = `import Component from '@glimmer/component';
export default class extends Component {}
`;
    const componentPath = `${componentFolderPath}/${demo.name.dashCase}.js`;
    const fullPath = path.join(process.cwd(), componentPath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, templateOnlyComponent);
    generatedFiles.push(componentPath);
  }

  return generatedFiles;
}
