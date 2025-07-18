import path from 'path';
import { pathToFileURL } from 'url';
import type { DocfyConfig } from '@docfy/core/lib/types';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:config');

interface EmberDocfyConfig extends DocfyConfig {
  remarkHbsOptions?: any;
}

export interface DocfyVitePluginOptions extends Partial<DocfyConfig> {
  /**
   * Root directory for the Ember app
   */
  root?: string;

  /**
   * Enable hot module replacement for markdown files
   * @default true
   */
  hmr?: boolean;

  /**
   * Docfy configuration object to use directly instead of loading from file
   */
  config?: Partial<EmberDocfyConfig>;

  /**
   * Path to the config file to load
   * @default 'docfy.config.js' or 'docfy.config.mjs'
   */
  configFile?: string;
}

const DEFAULT_CONFIG: DocfyConfig = {
  sources: [
    {
      pattern: '**/*.md',
      urlPrefix: 'docs'
    }
  ]
};

export async function loadDocfyConfig(
  root: string,
  options: DocfyVitePluginOptions = {}
): Promise<EmberDocfyConfig> {
  let docfyConfig: Partial<EmberDocfyConfig> = {};

  // Load package.json for repository info
  const pkg = await loadPackageJson(root);

  // If config is provided directly, use it
  if (options.config) {
    docfyConfig = options.config;
    debug('Using inline config');
  } else {
    // Determine config file path
    let configPath: string;
    if (options.configFile) {
      configPath = path.resolve(root, options.configFile);
    } else {
      // Try default config files in order
      const defaultConfigFiles = ['docfy.config.js', 'docfy.config.mjs'];
      configPath = '';

      for (const filename of defaultConfigFiles) {
        const testPath = path.join(root, filename);
        try {
          const fs = await import('fs');
          if (fs.existsSync(testPath)) {
            configPath = testPath;
            break;
          }
        } catch {
          // Continue to next file
        }
      }

      // Fallback to first default if none found
      if (!configPath) {
        configPath = path.join(root, defaultConfigFiles[0]);
      }
    }

    try {
      // Use dynamic import for both CJS and ESM
      const imported = await import(pathToFileURL(configPath).href);
      docfyConfig = imported?.default ?? imported;
      debug('Loaded config', { configPath });
    } catch (e: any) {
      const notFound =
        e.code === 'ERR_MODULE_NOT_FOUND' ||
        e.message?.includes('Cannot find module');
      if (!notFound) {
        throw e;
      }
      debug('No config file found, using defaults', { configPath });
      docfyConfig = {};
    }
  }

  // Merge with options and set defaults
  const mergedConfig = await mergeConfig(
    docfyConfig,
    options,
    pkg,
    !!options.config
  );
  debug('Final config', { sources: mergedConfig.sources?.length });

  return mergedConfig;
}

async function loadPackageJson(root: string): Promise<any> {
  try {
    const pkgPath = path.join(root, 'package.json');
    const fs = await import('fs');
    const content = fs.readFileSync(pkgPath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    debug('Could not load package.json', { root, error: e });
    return {};
  }
}

async function mergeConfig(
  docfyConfig: Partial<EmberDocfyConfig>,
  options: DocfyVitePluginOptions,
  pkg: any,
  isInlineConfig: boolean = false
): Promise<EmberDocfyConfig> {
  if (typeof docfyConfig !== 'object' || docfyConfig == null) {
    docfyConfig = {};
  }

  // Merge sources
  if (!Array.isArray(docfyConfig.sources)) {
    docfyConfig.sources = DEFAULT_CONFIG.sources;
  }

  // Merge plugins
  if (!Array.isArray(docfyConfig.plugins)) {
    docfyConfig.plugins = [];
  }

  // Add Docfy core plugins for demo and preview template processing
  const { demoComponents, previewTemplates, docfyLinkConversion } =
    await import('./docfy-plugins/index.js');
  // Debug: plugins loaded
  docfyConfig.plugins.unshift(
    previewTemplates, // Process preview templates first
    demoComponents, // Then process demo components
    docfyLinkConversion // Finally replace internal links with DocfyLink
  );

  // Setup remark plugins
  if (!Array.isArray(docfyConfig.remarkPlugins)) {
    docfyConfig.remarkPlugins = [];
  }

  // Add remark-hbs plugin
  const remarkHbs = (await import('remark-hbs')).default;
  docfyConfig.remarkPlugins.push([
    remarkHbs,
    docfyConfig.remarkHbsOptions || {}
  ]);

  // Setup repository info
  const repoUrl = pkg.repository?.url || pkg.repository;
  if (
    !docfyConfig.repository &&
    typeof repoUrl === 'string' &&
    repoUrl !== ''
  ) {
    docfyConfig.repository = {
      url: repoUrl
    };
  }

  // Set root for sources
  docfyConfig.sources.forEach((source) => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(options.root || process.cwd(), 'docs');
    }
  });

  // Merge with runtime options, excluding plugin-specific options
  const {
    root: _root,
    hmr: _hmr,
    config: _config,
    configFile: _configFile,
    ...docfyOptions
  } = options;

  // If inline config was provided, only merge docfyOptions that aren't already set in the inline config
  if (isInlineConfig) {
    const result = { ...docfyConfig } as EmberDocfyConfig;

    // Only merge docfyOptions that don't already exist in the inline config
    Object.keys(docfyOptions).forEach((key) => {
      if (!(key in docfyConfig)) {
        (result as any)[key] = (docfyOptions as any)[key];
      }
    });

    return result;
  }

  // For file-based config, merge normally
  return {
    ...docfyConfig,
    ...docfyOptions
  } as EmberDocfyConfig;
}
