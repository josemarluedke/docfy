import type { Plugin, ResolvedConfig } from 'vite';
import { createFilter } from '@rollup/pluginutils';
import Docfy from '@docfy/core';
import type { DocfyConfig } from '@docfy/core/lib/types';
import path from 'path';
import { loadDocfyConfig, DocfyVitePluginOptions } from './config.js';
import { createVirtualModules } from './virtual-modules.js';
import { processMarkdown } from './markdown-processor.js';
import { generateGJSComponents, generateTemplatePath, generatePageTemplate } from './gjs-generator.js';
import debugFactory from 'debug';
import fs from 'fs';

const debug = debugFactory('@docfy/ember-vite-plugin');

function findSourceConfigForFile(filePath: string, docfyInstance: Docfy): any {
  // Access the docfy config sources
  const sources = (docfyInstance as any).context?.options?.sources || [];
  
  for (const source of sources) {
    const sourcePath = path.resolve(source.root);
    const resolvedFilePath = path.resolve(filePath);
    
    if (resolvedFilePath.startsWith(sourcePath)) {
      return source;
    }
  }
  
  return null;
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
      enforce: 'pre', // Ensure this runs before other plugins
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
          
          // Generate templates for production build using emitFile
          if (config.command === 'build') {
            result.content.forEach(page => {
              const templatePath = generateTemplatePath(page.meta.url);
              const pageTemplate = generatePageTemplate(page);
              
              debug('Generating template in buildStart', { 
                url: page.meta.url, 
                templatePath,
                command: config.command
              });
              
              this.emitFile({
                type: 'asset',
                fileName: templatePath,
                source: pageTemplate
              });
            });
          } else {
            // For development mode, write templates to file system immediately
            debug('Writing templates to file system for development...');
            result.content.forEach(page => {
              const templatePath = generateTemplatePath(page.meta.url);
              const pageTemplate = generatePageTemplate(page);
              
              // Write template to file system for development
              const fullPath = path.join(process.cwd(), templatePath);
              const dir = path.dirname(fullPath);
              
              debug('Writing template to file system', { 
                url: page.meta.url, 
                templatePath, 
                fullPath 
              });
              
              // Ensure directory exists
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              
              // Write template file
              fs.writeFileSync(fullPath, pageTemplate);
            });
          }
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
        const result = await processMarkdown(code, id, docfyInstance, config);
        
        // For development mode, we'll handle template generation differently
        // since emitFile() is not supported in serve mode
        if (result && config.command === 'build') {
          try {
            // Re-run docfy to get the processed page info
            const sourceConfig = findSourceConfigForFile(id, docfyInstance);
            if (sourceConfig) {
              const docfyResult = await docfyInstance.run([{
                ...sourceConfig,
                pattern: path.basename(id),
                root: path.dirname(id)
              }]);
              
              if (docfyResult.content.length > 0) {
                const page = docfyResult.content[0];
                const templatePath = generateTemplatePath(page.meta.url);
                const pageTemplate = generatePageTemplate(page);
                
                debug('Emitting template file', { 
                  id, 
                  templatePath, 
                  url: page.meta.url,
                  command: config.command
                });
                
                this.emitFile({
                  type: 'asset',
                  fileName: templatePath,
                  source: pageTemplate
                });
              }
            }
          } catch (error) {
            debug('Error emitting template file', { id, error });
          }
        }
        
        return result;
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
      enforce: 'pre', // Ensure this runs before other plugins
      
      async generateBundle() {
        debug('Generating templates for build...');
        // Generate templates for all markdown pages
        try {
          await generateGJSComponents(this, docfyInstance, docfyConfig);
        } catch (error) {
          debug('Error generating templates', { error });
          // Don't throw to prevent build failure, just log
          console.warn('Failed to generate some templates:', error);
        }
      }
    }
  ];
}

// Export types for consumers
export type { DocfyConfig } from '@docfy/core/lib/types';
export type { DocfyVitePluginOptions } from './config.js';