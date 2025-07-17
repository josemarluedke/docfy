import path from 'path';
import { pathToFileURL } from 'url';
import type { DocfyConfig } from '@docfy/core/lib/types';
import type { DocfyVitePluginOptions } from './index';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:config');

interface EmberDocfyConfig extends DocfyConfig {
  remarkHbsOptions?: any;
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
    // Attempt to require (CJS)
    docfyConfig = require(configPath);
    debug('Loaded CJS config', { configPath });
  } catch (e: any) {
    // Fallback to ESM if the error indicates ESM-only module
    const isESMError =
      e.code === 'ERR_REQUIRE_ESM' ||
      e.message?.includes('must use import to load ES Module') ||
      e.message?.includes('Cannot use import statement outside a module');

    if (isESMError || e.code === 'ERR_MODULE_NOT_FOUND') {
      try {
        const imported = await import(pathToFileURL(configPath).href);
        docfyConfig = imported?.default ?? imported;
        debug('Loaded ESM config', { configPath });
      } catch (esmErr: any) {
        const notFound =
          esmErr.code === 'ERR_MODULE_NOT_FOUND' ||
          esmErr.message?.includes('Cannot find module');
        if (!notFound) {
          throw esmErr;
        }
        debug('No config file found, using defaults', { configPath });
        docfyConfig = {};
      }
    } else {
      throw e;
    }
  }

  // Merge with options and set defaults
  const mergedConfig = mergeConfig(docfyConfig, options, pkg);
  debug('Final config', { sources: mergedConfig.sources?.length });
  
  return mergedConfig;
}

async function loadPackageJson(root: string): Promise<any> {
  try {
    const pkgPath = path.join(root, 'package.json');
    return require(pkgPath);
  } catch (e) {
    debug('Could not load package.json', { root });
    return {};
  }
}

function mergeConfig(
  docfyConfig: Partial<EmberDocfyConfig>,
  options: DocfyVitePluginOptions,
  pkg: any
): EmberDocfyConfig {
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

  // Add Ember-specific plugins
  const emberPlugins = [
    // Import these from the ember package
    // replaceInternalLinksWithDocfyLink,
    // previewTemplate,
    // extractDemosToComponents
  ];

  docfyConfig.plugins.unshift(...emberPlugins);

  // Setup remark plugins
  if (!Array.isArray(docfyConfig.remarkPlugins)) {
    docfyConfig.remarkPlugins = [];
  }

  // Add remark-hbs plugin
  const remarkHbs = require('remark-hbs');
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
  docfyConfig.sources.forEach(source => {
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