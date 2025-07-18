import type { PluginContext } from 'rollup';
import type { DocfyConfig } from '@docfy/core/lib/types';
import path from 'path';
import fs from 'fs';
import fastGlob from 'fast-glob';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:utils');

/**
 * Check if a file should be processed by the plugin
 */
export function shouldProcessFile(
  filePath: string,
  docfyConfig: DocfyConfig,
  root: string
): boolean {
  if (!docfyConfig?.sources) return false;

  return docfyConfig.sources.some((source) => {
    const sourceRoot = path.resolve(source.root || root);
    const resolvedFilePath = path.resolve(filePath);

    // Check if file is within source root
    if (!resolvedFilePath.startsWith(sourceRoot)) {
      return false;
    }

    // Simple pattern matching for .md files
    return filePath.endsWith('.md');
  });
}

/**
 * Get all Docfy source files using glob patterns
 */
export async function getDocfySourceFiles(
  docfyConfig: DocfyConfig,
  root: string
): Promise<string[]> {
  if (!docfyConfig?.sources) return [];

  const allFiles: string[] = [];

  for (const source of docfyConfig.sources) {
    const sourceRoot = path.resolve(source.root || root);
    const pattern = source.pattern || '**/*.md';
    const ignore = source.ignore || [];

    try {
      const files = await fastGlob(pattern, {
        cwd: sourceRoot,
        absolute: true,
        ignore: ['node_modules/**', ...ignore]
      });

      allFiles.push(...files);

      debug('Found source files for pattern', {
        pattern,
        sourceRoot,
        fileCount: files.length
      });
    } catch (error) {
      debug('Error globbing files', { pattern, sourceRoot, error });
    }
  }

  return allFiles;
}


/**
 * Load virtual docfy-output module
 */
export function loadVirtualDocfyOutput(docfyResult: any): string {
  debug('Loading virtual:docfy-output', { hasResult: !!docfyResult });

  if (!docfyResult) {
    // Return empty structure when no result is available yet
    return `export default ${JSON.stringify({
      nested: { name: '/', pages: [], children: [] }
    })};`;
  }

  return `export default ${JSON.stringify({
    nested: docfyResult.nestedPageMetadata
  })};`;
}

