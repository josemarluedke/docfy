import type { Plugin, ResolvedConfig } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import Docfy from '@docfy/core';
import type { DocfyConfig } from '@docfy/core/lib/types';
import { loadDocfyConfig, DocfyVitePluginOptions } from './config.js';
import { createVirtualModules } from './virtual-modules.js';
import { processMarkdown } from './markdown-processor.js';
import { generateGJSComponents } from './gjs-generator.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin');

export default function docfyVitePlugin(options: DocfyVitePluginOptions = {}): Plugin[] {
  const {
    root = process.cwd(),
    include = ['**/*.md'],
    exclude = ['node_modules/**'],
    hmr = true,
    ...docfyOptions
  } = options;

  const filter = createFilter(include, exclude);
  
  let config: ResolvedConfig;
  let docfyConfig: DocfyConfig;
  let docfyInstance: Docfy;
  let virtualModules: ReturnType<typeof createVirtualModules>;

  return [
    {
      name: 'docfy-ember-vite-plugin:config',
      configResolved(resolvedConfig) {
        config = resolvedConfig;
        debug('Vite config resolved', { command: config.command, mode: config.mode });
      },

      async buildStart() {
        debug('Loading Docfy configuration...');
        docfyConfig = await loadDocfyConfig(root, docfyOptions);
        debug('Docfy configuration loaded', { 
          sources: docfyConfig.sources?.length,
          sourcesDetails: docfyConfig.sources?.map(s => ({ root: s.root, pattern: s.pattern, urlPrefix: s.urlPrefix })),
          include,
          exclude,
          root
        });
        docfyInstance = new Docfy(docfyConfig);
        virtualModules = createVirtualModules();
        
        // Process markdown files immediately to populate virtual modules
        try {
          debug('Processing markdown files...');
          const result = await docfyInstance.run(docfyConfig.sources as any);
          virtualModules.updateResult(result);
          debug('Markdown processing completed', { 
            contentCount: result.content.length,
            staticAssetsCount: result.staticAssets.length 
          });
        } catch (error) {
          debug('Error processing markdown files', { error });
        }
        
        debug('Docfy instance created and virtual modules initialized');
      },

      resolveId(id) {
        debug('Attempting to resolve ID', { id });
        const resolved = virtualModules.resolveId(id);
        if (resolved) {
          debug('Resolved virtual module', { id, resolved });
        } else if (id.startsWith('virtual:')) {
          debug('Failed to resolve virtual module', { id });
        }
        return resolved;
      },

      load(id) {
        const loaded = virtualModules.load(id);
        if (loaded) {
          debug('Loaded virtual module', { id, contentLength: loaded.length });
        }
        return loaded;
      },

      async transform(code, id) {
        if (!filter(id)) return null;
        
        debug('Processing markdown file', { id });
        return await processMarkdown(code, id, docfyInstance, config);
      },

      generateBundle() {
        debug('Generating bundle assets...');
        virtualModules.generateAssets(this);
      },

      ...(hmr && {
        handleHotUpdate(ctx) {
          if (config?.command === 'serve' && filter(ctx.file)) {
            debug('HMR update for markdown file', { file: ctx.file });
            // Invalidate virtual modules on markdown file changes
            virtualModules.invalidate();
            ctx.server.ws.send({
              type: 'full-reload'
            });
          }
        }
      })
    },

    {
      name: 'docfy-ember-vite-plugin:generate',
      apply: 'build',
      
      generateBundle() {
        debug('Generating GJS components for build...');
        generateGJSComponents(this, docfyInstance, docfyConfig);
      }
    }
  ];
}

// Export types for consumers
export type { DocfyConfig } from '@docfy/core/lib/types';
export type { DocfyVitePluginOptions } from './config.js';