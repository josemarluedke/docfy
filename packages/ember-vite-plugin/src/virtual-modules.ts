import type { EmittedFile, PluginContext } from 'rollup';
import type { DocfyResult } from '@docfy/core/lib/types';
import fs from 'fs';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:virtual-modules');

export interface VirtualModuleSystem {
  resolveId(id: string): string | null;
  load(id: string): string | null;
  updateResult(result: DocfyResult): void;
  generateAssets(context: PluginContext): void;
  invalidate(): void;
}

const VIRTUAL_MODULE_PREFIX = '\0virtual:';

const VIRTUAL_MODULES = {
  'virtual:docfy-output': `${VIRTUAL_MODULE_PREFIX}docfy-output`,
  'virtual:docfy-urls': `${VIRTUAL_MODULE_PREFIX}docfy-urls`,
  'virtual:docfy-snippets': `${VIRTUAL_MODULE_PREFIX}docfy-snippets`,
} as const;

export function createVirtualModules(): VirtualModuleSystem {
  let docfyResult: DocfyResult | null = null;
  let isInvalidated = false;

  return {
    resolveId(id: string): string | null {
      if (id in VIRTUAL_MODULES) {
        debug('Resolving virtual module', { id });
        return VIRTUAL_MODULES[id as keyof typeof VIRTUAL_MODULES];
      }
      return null;
    },

    load(id: string): string | null {
      if (!docfyResult) {
        debug('No Docfy result available for virtual module', { id });
        return null;
      }

      switch (id) {
        case VIRTUAL_MODULES['virtual:docfy-output']:
          debug('Loading virtual:docfy-output');
          return `export default ${JSON.stringify({
            nested: docfyResult.nestedPageMetadata
          })};`;

        case VIRTUAL_MODULES['virtual:docfy-urls']:
          debug('Loading virtual:docfy-urls');
          const urls = docfyResult.content.map(page => page.meta.url);
          return `export default ${JSON.stringify(urls)};`;

        case VIRTUAL_MODULES['virtual:docfy-snippets']:
          debug('Loading virtual:docfy-snippets');
          const snippets = extractSnippets(docfyResult);
          return `export default ${JSON.stringify(snippets)};`;

        default:
          return null;
      }
    },

    updateResult(result: DocfyResult): void {
      debug('Updating Docfy result', { 
        contentCount: result.content.length,
        staticAssetsCount: result.staticAssets.length 
      });
      docfyResult = result;
      isInvalidated = false;
    },

    generateAssets(context: PluginContext): void {
      if (!docfyResult) {
        debug('No Docfy result available for asset generation');
        return;
      }

      // Generate JSON files for public consumption
      const urlsAsset: EmittedFile = {
        type: 'asset',
        fileName: 'docfy-urls.json',
        source: JSON.stringify(docfyResult.content.map(page => page.meta.url))
      };

      const snippetsAsset: EmittedFile = {
        type: 'asset',
        fileName: 'docfy-snippets.json',
        source: JSON.stringify(extractSnippets(docfyResult))
      };

      context.emitFile(urlsAsset);
      context.emitFile(snippetsAsset);

      // Copy static assets
      docfyResult.staticAssets.forEach(asset => {
        const staticAsset: EmittedFile = {
          type: 'asset',
          fileName: asset.toPath,
          source: fs.readFileSync(asset.fromPath)
        };
        context.emitFile(staticAsset);
      });

      debug('Generated assets', { 
        urls: true,
        snippets: true,
        staticAssets: docfyResult.staticAssets.length 
      });
    },

    invalidate(): void {
      debug('Invalidating virtual modules');
      isInvalidated = true;
      docfyResult = null;
    }
  };
}


function extractSnippets(result: DocfyResult): Record<string, any> {
  const snippets: Record<string, any> = {
    components: {}
  };

  result.content.forEach(page => {
    // Extract demo components from pluginData
    const demoComponents = page.pluginData?.demoComponents;
    if (Array.isArray(demoComponents)) {
      demoComponents.forEach((component: any) => {
        if (component.chunks && Array.isArray(component.chunks)) {
          component.chunks.forEach((chunk: any) => {
            const componentName = component.name?.dashCase || component.name;
            if (componentName) {
              snippets.components[componentName] = {
                ...(snippets.components[componentName] || {}),
                [chunk.ext]: chunk.code
              };
            }
          });
        }
      });
    }
  });

  return snippets;
}