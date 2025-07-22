import type { Plugin, ResolvedConfig } from 'vite';
import type { DocfyConfig } from '@docfy/core/lib/types';
import { loadDocfyConfig, DocfyVitePluginOptions } from './config.js';
import { processMarkdown } from './markdown-processor.js';
import { shouldProcessFile, loadVirtualDocfyOutput } from './utils.js';
import { DocfyProcessor } from './docfy-processor.js';
import { FileManager } from './file-manager.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite');

const VIRTUAL_MODULE_PREFIX = '\0';
const DOCFY_OUTPUT_MODULE = '@docfy/ember-output';
const VIRTUAL_DOCFY_OUTPUT = `${VIRTUAL_MODULE_PREFIX}${DOCFY_OUTPUT_MODULE}`;

export default function docfyVitePlugin(options: DocfyVitePluginOptions = {}): Plugin[] {
  const {
    root = process.cwd(),
    hmr = true,
    config: inlineConfig,
    configFile,
    ...docfyOptions
  } = options;

  let config: ResolvedConfig;
  let docfyConfig: DocfyConfig;
  let processor: DocfyProcessor;
  let fileManager: FileManager;

  return [
    {
      name: 'docfy-ember-vite:config',
      enforce: 'pre', // Ensure this runs before other plugins
      configResolved(resolvedConfig) {
        config = resolvedConfig;
        debug('Vite config resolved', {
          command: config.command,
          mode: config.mode,
        });
      },

      async buildStart() {
        debug('Loading Docfy configuration...');
        docfyConfig = await loadDocfyConfig(root, {
          ...docfyOptions,
          config: inlineConfig,
          configFile,
        });
        debug('Docfy configuration loaded', {
          sources: docfyConfig.sources?.length,
          sourcesDetails: docfyConfig.sources?.map(s => ({
            root: s.root,
            pattern: s.pattern,
            urlPrefix: s.urlPrefix,
          })),
          root,
        });

        // Initialize core components
        fileManager = new FileManager(config, this);
        processor = new DocfyProcessor(config, docfyConfig, fileManager);

        // Add all Docfy source files to Vite's watch list
        if (config.command === 'serve') {
          const sourceFiles = await processor.getSourceFiles();
          sourceFiles.forEach(file => {
            debug('Adding file to watch list', { file });
            this.addWatchFile(file);
          });
        }

        // Process markdown files immediately
        try {
          await processor.processAll();
        } catch (error) {
          debug('Error processing markdown files', { error });
        }

        debug('Docfy processor initialized');
      },

      resolveId(id) {
        debug('Attempting to resolve ID', { id });
        if (id === DOCFY_OUTPUT_MODULE) {
          debug('Resolved virtual module', { id });
          return VIRTUAL_DOCFY_OUTPUT;
        }
        return null;
      },

      load(id) {
        if (id === VIRTUAL_DOCFY_OUTPUT) {
          return loadVirtualDocfyOutput(processor?.getCurrentResult());
        }
        return null;
      },

      transform(code, id) {
        if (!shouldProcessFile(id, docfyConfig, root)) return null;

        debug('Processing markdown file', { id });
        const result = processMarkdown(code, id, processor);

        return result;
      },

      generateBundle() {
        debug('Generating bundle assets...');
        const result = processor?.getCurrentResult();
        if (result) {
          fileManager.emitStaticAssets(result.staticAssets);
        }
      },

      ...(hmr && {
        async handleHotUpdate(ctx) {
          if (config?.command === 'serve' && shouldProcessFile(ctx.file, docfyConfig, root)) {
            debug('HMR update for markdown file', { file: ctx.file });

            try {
              await processor.processChangedFile(ctx.file);
              debug('Template regenerated successfully');
            } catch (error) {
              debug('Error regenerating templates', { error });
            }

            return [];
          }
        },
      }),
    },
  ];
}

// Export types for consumers
export type { DocfyConfig } from '@docfy/core/lib/types';
export type { DocfyVitePluginOptions } from './config.js';
