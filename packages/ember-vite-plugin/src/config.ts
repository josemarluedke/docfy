import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import type { DocfyConfig } from '@docfy/core/lib/types';
import debugFactory from 'debug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const debug = debugFactory('@docfy/ember-vite-plugin:config');

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
  const configPath = path.join(root, '.docfy-config.js');
  let docfyConfig: Partial<EmberDocfyConfig> = {};

  // Load package.json for repository info
  const pkg = await loadPackageJson(root);

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

  // Merge with options and set defaults
  const mergedConfig = await mergeConfig(docfyConfig, options, pkg);
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
  pkg: any
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
  const { demoComponents, previewTemplates } = await import(
    './docfy-plugins/index.js'
  );
  // Debug: plugins loaded
  docfyConfig.plugins.unshift(
    previewTemplates, // Process preview templates first
    demoComponents // Then process demo components
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

  // Merge with runtime options
  return {
    ...docfyConfig,
    ...options
  } as EmberDocfyConfig;
}
