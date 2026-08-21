import path from 'path';
import fs from 'fs';
import { DocfyConfig } from '@docfy/core/lib/types.js';
import remarkHbs from 'remark-hbs';
import replaceInternalLinksWithDocfyLink from './plugins/replace-internal-links-with-docfy-link';
import extractDemosToComponents from './plugins/extract-demos-to-components';
import previewTemplate from './plugins/preview-template';
import escapeCurliesInCode from './plugins/escape-curlies-in-code';
import type { RemarkHbsOptions } from 'remark-hbs';

const DEFAULT_CONFIG: DocfyConfig = {
  sources: [
    {
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
};

const CONFIG_FILE_NAMES = ['.docfy-config.js', '.docfy-config.mjs', '.docfy-config.cjs'];

interface EmberDocfyConfig extends DocfyConfig {
  remarkHbsOptions?: RemarkHbsOptions;
}

function findConfigFile(root: string): string | undefined {
  return CONFIG_FILE_NAMES.map(name => path.join(root, name)).find(file => fs.existsSync(file));
}

/**
 * Loads the user config file.
 *
 * Node supports `require()` of ES modules (>= 20.19 / >= 22.12), so a single
 * synchronous `require` handles CommonJS and ESM config files alike. The only
 * thing it cannot load is an ESM config using top-level `await`, which throws
 * `ERR_REQUIRE_ASYNC_MODULE`.
 */
function loadConfigFile(root: string): Partial<EmberDocfyConfig> {
  const configPath = findConfigFile(root);

  if (!configPath) {
    return {};
  }

  let loaded: unknown;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loaded = require(configPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.code === 'ERR_REQUIRE_ASYNC_MODULE') {
      throw new Error(
        `[docfy] ${path.basename(configPath)} uses top-level await, which Ember CLI's ` +
          `synchronous build cannot load. Move the await into a Docfy plugin, or use ` +
          `@docfy/ember-vite, which loads the config asynchronously.`
      );
    }

    throw e;
  }

  // require(esm) returns the module namespace, so unwrap the default export.
  const namespace = loaded as { __esModule?: boolean; default?: unknown } | null;
  const config = namespace?.__esModule || namespace?.default ? namespace.default : loaded;

  if (typeof config !== 'object' || config === null) {
    return {};
  }

  return config as Partial<EmberDocfyConfig>;
}

function normalizeConfig(root: string, config: Partial<EmberDocfyConfig>): EmberDocfyConfig {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pkg = require(path.join(root, 'package.json'));

  if (!Array.isArray(config.sources)) {
    config.sources = DEFAULT_CONFIG.sources;
  }

  if (!Array.isArray(config.plugins)) {
    config.plugins = [];
  }

  config.plugins.unshift(
    replaceInternalLinksWithDocfyLink,
    previewTemplate,
    extractDemosToComponents
  );

  // Escaping happens at the hast stage so that it also covers markup injected
  // by rehype-based syntax highlighters. See ./plugins/escape-curlies-in-code.
  config.plugins.push(escapeCurliesInCode);

  // Docfy owns these two: escaping happens at the hast stage instead, so
  // letting remark-hbs also escape at the mdast stage would double-escape.
  config.remarkHbsOptions = {
    ...config.remarkHbsOptions,
    escapeCurliesCode: false,
    escapeCurliesInlineCode: false,
  };

  if (!Array.isArray(config.remarkPlugins)) {
    config.remarkPlugins = [];
  }

  config.remarkPlugins.push([remarkHbs, config.remarkHbsOptions || {}]);

  const repoUrl = pkg.repository?.url || pkg.repository;

  if (!config.repository && typeof repoUrl === 'string' && repoUrl !== '') {
    config.repository = { url: repoUrl };
  }

  config.sources.forEach(source => {
    if (typeof source.root === 'undefined') {
      source.root = path.join(root, 'docs');
    }
  });

  return config as EmberDocfyConfig;
}

function getDocfyConfigSync(root: string): EmberDocfyConfig {
  return normalizeConfig(root, loadConfigFile(root));
}

export default async function getDocfyConfig(root: string): Promise<EmberDocfyConfig> {
  return getDocfyConfigSync(root);
}

export { getDocfyConfigSync };
