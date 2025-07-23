import path from 'path';
import { pathToFileURL } from 'url';
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
      urlPrefix: 'docs',
    },
  ],
};

interface EmberDocfyConfig extends DocfyConfig {
  remarkHbsOptions?: RemarkHbsOptions;
}

function getDocfyConfigSync(root: string): EmberDocfyConfig {
  const configPath = path.join(root, '.docfy-config.js');
  let docfyConfig: Partial<EmberDocfyConfig> = {};

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pkg = require(path.join(root, 'package.json'));

  try {
    // Attempt to require (CJS)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    docfyConfig = require(configPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // For ESM or missing config, use default
    const isESMError =
      e.code === 'ERR_REQUIRE_ESM' ||
      e.message?.includes('must use import to load ES Module') ||
      e.message?.includes('Cannot use import statement outside a module');

    const notFound = e.code === 'ERR_MODULE_NOT_FOUND' || e.message?.includes('Cannot find module');

    if (isESMError) {
      console.warn(
        `[docfy] ESM config files are not supported in Ember CLI classic build. Please use CommonJS format (.docfy-config.js) or switch to @docfy/ember-vite. Using default configuration.`
      );
      docfyConfig = {};
    } else if (notFound) {
      // Config file doesn't exist, use default
      docfyConfig = {};
    } else {
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

  docfyConfig.remarkPlugins.push([remarkHbs, docfyConfig.remarkHbsOptions || {}]);

  const repoUrl = pkg.repository?.url || pkg.repository;

  if (!docfyConfig.repository && typeof repoUrl === 'string' && repoUrl !== '') {
    docfyConfig.repository = {
      url: repoUrl,
    };
  }

  docfyConfig.sources.forEach(source => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(root, 'docs');
    }
  });

  return docfyConfig as EmberDocfyConfig;
}

export default async function getDocfyConfig(root: string): Promise<EmberDocfyConfig> {
  const configPath = path.join(root, '.docfy-config.js');
  let docfyConfig: Partial<EmberDocfyConfig> = {};

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pkg = require(path.join(root, 'package.json'));

  try {
    // Attempt to require (CJS)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    docfyConfig = require(configPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (esmErr: any) {
        const notFound =
          esmErr.code === 'ERR_MODULE_NOT_FOUND' || esmErr.message?.includes('Cannot find module');
        if (!notFound) {
          throw esmErr;
        }
        docfyConfig = {};
      }
    } else {
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

  docfyConfig.remarkPlugins.push([remarkHbs, docfyConfig.remarkHbsOptions || {}]);

  const repoUrl = pkg.repository?.url || pkg.repository;

  if (!docfyConfig.repository && typeof repoUrl === 'string' && repoUrl !== '') {
    docfyConfig.repository = {
      url: repoUrl,
    };
  }

  docfyConfig.sources.forEach(source => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(root, 'docs');
    }
  });

  return docfyConfig as EmberDocfyConfig;
}

export { getDocfyConfigSync };
