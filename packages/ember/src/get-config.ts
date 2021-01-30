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

export default function getDocfyConfig(root: string): EmberDocfyConfig {
  const configPath = path.join(root, '.docfy-config.js');
  let docfyConfig: EmberDocfyConfig = DEFAULT_CONFIG;

  const pkg = require(path.join(root, 'package.json')); // eslint-disable-line

  try {
    docfyConfig = require(configPath); // eslint-disable-line @typescript-eslint/no-require-imports
  } catch (e) {
    if (!e.message.match(new RegExp(`Cannot find module .${configPath}`))) {
      throw e;
    }
  }

  if (typeof docfyConfig === 'object') {
    if (typeof docfyConfig.sources === 'undefined') {
      docfyConfig.sources = DEFAULT_CONFIG.sources;
    }

    if (!Array.isArray(docfyConfig.sources)) {
      console.warn(
        'Docfy expected an array for sources in .docfy-config.js, received ',
        typeof docfyConfig.sources
      );

      docfyConfig.sources = DEFAULT_CONFIG.sources;
    }
  } else {
    docfyConfig = DEFAULT_CONFIG;
  }

  const repoUrl = pkg.repository.url || pkg.repository;

  if (
    !docfyConfig.repository &&
    typeof repoUrl === 'string' &&
    repoUrl !== ''
  ) {
    docfyConfig.repository = {
      url: repoUrl
    };
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

  docfyConfig.sources.forEach((source) => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(root, 'docs');
    }
  });

  return docfyConfig;
}
