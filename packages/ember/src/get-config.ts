import path from 'path';
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
    // Attempt to require (CJS)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    docfyConfig = require(configPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // For ESM modules or missing files, fall back to empty config
    const isESMError =
      e.code === 'ERR_REQUIRE_ESM' ||
      e.message?.includes('must use import to load ES Module') ||
      e.message?.includes('Cannot use import statement outside a module');

    if (isESMError || e.code === 'ERR_MODULE_NOT_FOUND') {
      // ESM configs are not supported in synchronous mode, use defaults
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
