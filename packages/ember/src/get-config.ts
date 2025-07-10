import path from 'path';
import { createRequire } from 'module';
import { DocfyConfig } from '@docfy/core/lib/types';
import remarkHbs from 'remark-hbs';
import replaceInternalLinksWithDocfyLink from './plugins/replace-internal-links-with-docfy-link';
import extractDemosToComponents from './plugins/extract-demos-to-components';
import previewTemplate from './plugins/preview-template';
import type { RemarkHbsOptions } from 'remark-hbs';

const DEFAULT_CONFIG: DocfyConfig = {
  sources: [
    {
      pattern: '**/*.md',
      urlPrefix: 'docs'
    }
  ]
};

interface EmberDocfyConfig extends DocfyConfig {
  remarkHbsOptions?: RemarkHbsOptions;
}

export default function getDocfyConfig(
  root: string
): EmberDocfyConfig {
  const configPath = path.join(root, '.docfy-config.js');
  let docfyConfig: Partial<EmberDocfyConfig> = {};

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const pkg = require(path.join(root, 'package.json'));

  try {
    // First attempt: Direct require (CJS)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loadedConfig = require(configPath);
    // Handle ESM default export pattern
    docfyConfig = loadedConfig && typeof loadedConfig === 'object' && loadedConfig.__esModule 
      ? loadedConfig.default 
      : loadedConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // Second attempt: Use createRequire for better ESM compatibility
    const isESMError =
      e.code === 'ERR_REQUIRE_ESM' ||
      e.message?.includes('must use import to load ES Module') ||
      e.message?.includes('Cannot use import statement outside a module');

    if (isESMError) {
      try {
        // Create a require function from the config file location
        // This can handle some ESM modules that export compatible objects
        const requireFromConfig = createRequire(configPath);
        const loadedConfig = requireFromConfig(configPath);
        // Handle ESM default export pattern and ensure object is mutable
        const rawConfig = loadedConfig && typeof loadedConfig === 'object' && loadedConfig.__esModule 
          ? loadedConfig.default 
          : loadedConfig;
        // Create a deep copy to ensure the config object is mutable
        docfyConfig = JSON.parse(JSON.stringify(rawConfig));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (createRequireError: any) {
        // If createRequire also fails, fall back to empty config
        // This happens with pure ESM modules that can't be required synchronously
        if (createRequireError.code === 'ERR_MODULE_NOT_FOUND') {
          docfyConfig = {};
        } else {
          // For other createRequire errors, fall back to defaults
          // This preserves ESM support for modules that can be loaded this way
          docfyConfig = {};
        }
      }
    } else if (e.code === 'ERR_MODULE_NOT_FOUND' || e.code === 'MODULE_NOT_FOUND') {
      // Config file doesn't exist
      docfyConfig = {};
    } else {
      // Re-throw unexpected errors
      throw e;
    }
  }

  if (typeof docfyConfig !== 'object' || docfyConfig == null) {
    docfyConfig = {};
  }

  if (!Array.isArray(docfyConfig.sources)) {
    docfyConfig.sources = DEFAULT_CONFIG.sources;
  }

  if (!Array.isArray(docfyConfig.plugins)) {
    docfyConfig.plugins = [];
  }

  docfyConfig.plugins.unshift(
    replaceInternalLinksWithDocfyLink,
    previewTemplate,
    extractDemosToComponents
  );

  if (!Array.isArray(docfyConfig.remarkPlugins)) {
    docfyConfig.remarkPlugins = [];
  }

  docfyConfig.remarkPlugins.push([
    remarkHbs,
    docfyConfig.remarkHbsOptions || {}
  ]);

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

  docfyConfig.sources.forEach((source) => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(root, 'docs');
    }
  });

  return docfyConfig as EmberDocfyConfig;
}
