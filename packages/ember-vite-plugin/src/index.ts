import type { Plugin, ResolvedConfig } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import Docfy from '@docfy/core';
import type { DocfyConfig } from '@docfy/core/lib/types';
import { loadDocfyConfig } from './config';
import { createVirtualModules } from './virtual-modules';
import { processMarkdown } from './markdown-processor';
import { generateGJSComponents } from './gjs-generator';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin');

export interface DocfyVitePluginOptions extends Partial<DocfyConfig> {
  /**
   * Root directory for the Ember app
   */
  root?: string;

  /**
   * Include patterns for markdown files
   * @default ['**\/*.md']
   */
  include?: string | string[];

  /**
   * Exclude patterns for markdown files
   * @default ['node_modules/**']
   */
  exclude?: string | string[];

  /**
   * Enable hot module replacement for markdown files
   * @default true
   */
  hmr?: boolean;
}

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
        docfyInstance = new Docfy(docfyConfig);
        virtualModules = createVirtualModules();
        
        debug('Docfy configuration loaded', { sources: docfyConfig.sources?.length });
      },

      resolveId(id) {
        return virtualModules.resolveId(id);
      },

      load(id) {
        return virtualModules.load(id);
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