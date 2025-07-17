import type { Plugin, ResolvedConfig } from 'vite';
import type { PluginContext } from 'rollup';
import Docfy from '@docfy/core';
import type { DocfyConfig } from '@docfy/core/lib/types';
import path from 'path';
import { loadDocfyConfig, DocfyVitePluginOptions } from './config.js';
import { createVirtualModules } from './virtual-modules.js';
import { processMarkdown } from './markdown-processor.js';
import {
  generateTemplatePath,
  generatePageTemplate
} from './gjs-generator.js';
import debugFactory from 'debug';
import fs from 'fs';
import fastGlob from 'fast-glob';

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

export default function docfyVitePlugin(
  options: DocfyVitePluginOptions = {}
): Plugin[] {
  const { root = process.cwd(), hmr = true, ...docfyOptions } = options;

  function shouldProcessFile(filePath: string): boolean {
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

  async function getDocfySourceFiles(): Promise<string[]> {
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
        debug('Vite config resolved', {
          command: config.command,
          mode: config.mode
        });
      },

      async buildStart() {
        debug('Loading Docfy configuration...');
        docfyConfig = await loadDocfyConfig(root, docfyOptions);
        debug('Docfy configuration loaded', {
          sources: docfyConfig.sources?.length,
          sourcesDetails: docfyConfig.sources?.map((s) => ({
            root: s.root,
            pattern: s.pattern,
            urlPrefix: s.urlPrefix
          })),
          root
        });
        docfyInstance = new Docfy(docfyConfig);
        virtualModules = createVirtualModules();

        // Add all Docfy source files to Vite's watch list
        if (config.command === 'serve') {
          const sourceFiles = await getDocfySourceFiles();
          sourceFiles.forEach((file) => {
            debug('Adding file to watch list', { file });
            this.addWatchFile(file);
          });
        }

        // Process markdown files immediately to populate virtual modules
        try {
          debug('Processing markdown files...');
          const result = await docfyInstance.run(docfyConfig.sources as any);
          virtualModules.updateResult(result);
          debug('Markdown processing completed', {
            contentCount: result.content.length,
            staticAssetsCount: result.staticAssets.length
          });

          // Generate templates for both development and production using file system writes
          debug('Writing templates to file system...');
          result.content.forEach((page) => {
            const templatePath = generateTemplatePath(page.meta.url);
            const pageTemplate = generatePageTemplate(page, this);

            // Write template to file system
            const fullPath = path.join(process.cwd(), templatePath);
            const dir = path.dirname(fullPath);

            debug('Writing template to file system', {
              url: page.meta.url,
              templatePath,
              fullPath,
              command: config.command
            });

            // Ensure directory exists
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            // Write template file
            fs.writeFileSync(fullPath, pageTemplate);
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
        if (!shouldProcessFile(id)) return null;

        debug('Processing markdown file', { id });
        const result = await processMarkdown(code, id, docfyInstance, config);

        // For development mode, templates are generated in buildStart
        // For production, templates are generated in the second plugin's generateBundle hook
        // No need to generate templates here to avoid conflicts

        return result;
      },

      generateBundle() {
        debug('Generating bundle assets...');
        virtualModules.generateAssets(this);
      },

      ...(hmr && {
        async handleHotUpdate(ctx) {
          if (config?.command === 'serve' && shouldProcessFile(ctx.file)) {
            debug('HMR update for markdown file', { file: ctx.file });

            // Regenerate templates when markdown files change
            try {
              debug('Regenerating templates due to file change...');
              const result = await docfyInstance.run(
                docfyConfig.sources as any
              );
              virtualModules.updateResult(result);

              // Find the specific page that corresponds to the changed file
              const changedPage = result.content.find((page) => {
                // Check if this page's source file matches the changed file
                return page.vFile.path === ctx.file;
              });

              if (changedPage) {
                // Only regenerate the template for the changed file
                const templatePath = generateTemplatePath(changedPage.meta.url);
                // Create a minimal context-like object for component generation
                const contextForGeneration = {
                  emitFile: () => {}, // Not needed in HMR - we write directly to filesystem
                } as unknown as PluginContext;
                const pageTemplate = generatePageTemplate(changedPage, contextForGeneration);

                const fullPath = path.join(process.cwd(), templatePath);
                const dir = path.dirname(fullPath);

                debug('Regenerating template file for changed page', {
                  url: changedPage.meta.url,
                  templatePath,
                  fullPath,
                  changedFile: ctx.file
                });

                // Ensure directory exists
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }

                // Write template file
                fs.writeFileSync(fullPath, pageTemplate);

                // Invalidate the specific template file in Vite's module graph
                const templateModule =
                  ctx.server.moduleGraph.getModuleById(fullPath);
                if (templateModule) {
                  ctx.server.reloadModule(templateModule);
                } else {
                  // If template module doesn't exist in graph, try to find it by looking at imports
                  const modules =
                    ctx.server.moduleGraph.getModulesByFile(fullPath);
                  if (modules) {
                    for (const mod of modules) {
                      ctx.server.reloadModule(mod);
                    }
                  }
                }
              } else {
                debug('No matching page found for changed file', {
                  file: ctx.file
                });
              }

              debug('Template regenerated successfully');
            } catch (error) {
              debug('Error regenerating templates', { error });
            }

            // Return empty array to prevent default HMR behavior
            return [];
          }
        }
      })
    },

    {
      name: 'docfy-ember-vite-plugin:generate',
      enforce: 'pre', // Ensure this runs before other plugins

      async generateBundle() {
        debug('Generating bundle assets...');
        // Generate virtual module assets, but not templates (already handled in first plugin)
        virtualModules.generateAssets(this);
      }
    }
  ];
}

// Export types for consumers
export type { DocfyConfig } from '@docfy/core/lib/types';
export type { DocfyVitePluginOptions } from './config.js';
