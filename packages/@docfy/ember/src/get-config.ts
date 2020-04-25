import { DocfyConfig } from '@docfy/core/dist/types';

const DEFAULT_CONFIG: DocfyConfig = {
  sources: [
    {
      pattern: '/docs/**/*.md'
    }
  ]
};

export default function getDocfyConfig(
  configPath: string,
  defaultRoot: string
): DocfyConfig {
  let docfyConfig: DocfyConfig = DEFAULT_CONFIG;

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

  docfyConfig.sources.forEach((source) => {
    if (typeof source.root === 'undefined') {
      source.root = defaultRoot;
    }
  });

  return docfyConfig;
}
