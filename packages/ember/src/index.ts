import fs from 'fs';
import path from 'path';
import BroccoliBridge from 'broccoli-bridge';
import Funnel from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Plugin from 'broccoli-plugin';
import WriteFile from 'broccoli-file-creator';
import { Node, InputNode } from 'broccoli-node-api';
import { UnwatchedDir } from 'broccoli-source';
import Docfy from '@docfy/core';
import { DocfyConfig, SourceConfig } from '@docfy/core/lib/types';
import { DemoComponentChunk } from './plugins/types';
import docfyOutputTemplate from './docfy-output-template';
import getDocfyConfig from './get-config';
import { isDemoComponents } from './plugins/utils';
import cacheKeyForTree from 'calculate-cache-key-for-tree';
import debugFactory from 'debug';
const debug = debugFactory('@docfy/ember');

const templateOnlyComponent = `
import Component from '@glimmer/component';
export default class extends Component {}
`;

function ensureDirectoryExistence(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function hasBackingJS(chunks: DemoComponentChunk[]): boolean {
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (['js', 'ts', 'gts', 'gjs'].includes(chunk.ext)) {
      return true;
    }
  }
  return false;
}

// eslint-disable-next-line
function isDeepAddonInstance(addon: any): boolean {
  return addon.parent !== addon.project;
}

class DocfyBroccoli extends Plugin {
  config: DocfyConfig;

  constructor(inputNodes: InputNode[], options = {}) {
    super(inputNodes, options);
    this.config = options as DocfyConfig;
  }

  async build(): Promise<void> {
    debug('Output Path: ', this.outputPath);
    debug('Config: ', this.config);
    const docfy = new Docfy(this.config);
    const result = await docfy.run(this.config.sources as SourceConfig[]);
    const snippets = {
      components: {}
    };
    result.content.forEach((page) => {
      const parts = [this.outputPath, 'templates', page.meta.url];

      if (page.meta.url[page.meta.url.length - 1] === '/') {
        parts.push('index');
      }

      const fileName = `${path.join(...parts)}.hbs`;

      // console.log(fileName, "RENDERED AS", page.rendered);
      ensureDirectoryExistence(fileName);
      fs.writeFileSync(fileName, page.rendered);

      const demoComponents = page.pluginData.demoComponents;
      if (isDemoComponents(demoComponents)) {
        demoComponents.forEach((component) => {
          component.chunks.forEach((chunk) => {
            const chunkPath = path.join(
              this.outputPath,
              'components',
              `${component.name.dashCase}.${chunk.ext}`
            );
            ensureDirectoryExistence(chunkPath);

            snippets.components[`${component.name.dashCase}`] = {
              ...(snippets.components[`${component.name.dashCase}`] || {}),
              [chunk.ext]: chunk.code
            };
            fs.writeFileSync(chunkPath, chunk.code);
          });

          if (!hasBackingJS(component.chunks)) {
            const chunkPath = path.join(
              this.outputPath,
              'components',
              `${component.name.dashCase}.js`
            );
            ensureDirectoryExistence(chunkPath);
            snippets.components[`${component.name.dashCase}`] = {
              ...(snippets.components[`${component.name.dashCase}`] || {}),
              js: templateOnlyComponent
            };
            fs.writeFileSync(chunkPath, templateOnlyComponent);
          }
        });
      }
    });

    fs.writeFileSync(
      path.join(this.outputPath, 'docfy-output.js'),
      `export default ${JSON.stringify({ nested: result.nestedPageMetadata })};`
    );

    const urlsJsonFile = path.join(
      this.outputPath,
      'public',
      'docfy-urls.json'
    );

    ensureDirectoryExistence(urlsJsonFile);
    fs.writeFileSync(
      urlsJsonFile,
      JSON.stringify(result.content.map((page) => page.meta.url))
    );
    const snippetsJsonFile = path.join(
      this.outputPath,
      'public',
      'docfy-snippets.json'
    );
    ensureDirectoryExistence(snippetsJsonFile);
    fs.writeFileSync(snippetsJsonFile, JSON.stringify(snippets));
    result.staticAssets.forEach((asset) => {
      const dest = path.join(this.outputPath, 'public', asset.toPath);
      ensureDirectoryExistence(dest);
      fs.copyFileSync(asset.fromPath, dest);
    });
  }
}

module.exports = {
  name: require('../package').name, // eslint-disable-line

  docfyConfig: undefined,
  _loadingConfig: false,

  included(...args: unknown[]): void {
    if (!isDeepAddonInstance(this)) {
      this.bridge = new BroccoliBridge();
      // Don't load config here, defer until needed
    }
    this._super.included.apply(this, args);
  },

  // Helper method to ensure config is loaded
  _ensureDocfyConfig(): void {
    if (!this.docfyConfig && !this._loadingConfig) {
      this._loadingConfig = true;
      // Use a synchronous approach for now, falling back to default config for ESM cases
      try {
        this.docfyConfig = this._getDocfyConfigSync(this.project.root);
      } catch (error) {
        console.warn('Failed to load docfy config, using defaults:', error);
        this.docfyConfig = {
          sources: [
            {
              pattern: '**/*.md',
              urlPrefix: 'docs',
              root: this.project.root + '/docs'
            }
          ]
        };
      }
    }
  },

  _getDocfyConfigSync(root: string): any {
    const path = require('path');
    const configPath = path.join(root, '.docfy-config.js');
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const pkg = require(path.join(root, 'package.json'));
    
    let docfyConfig: any = {};
    
    try {
      // Try to require the config file
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      docfyConfig = require(configPath);
    } catch (e: any) {
      // If it's an ESM module, we can't load it synchronously
      // Fall back to empty config which will be filled with defaults
      const isESMError =
        e.code === 'ERR_REQUIRE_ESM' ||
        e.message?.includes('must use import to load ES Module') ||
        e.message?.includes('Cannot use import statement outside a module');
      
      if (!isESMError && e.code !== 'ERR_MODULE_NOT_FOUND') {
        throw e;
      }
      
      docfyConfig = {};
    }

    if (typeof docfyConfig !== 'object' || docfyConfig == null) {
      docfyConfig = {};
    }

    if (!Array.isArray(docfyConfig.sources)) {
      docfyConfig.sources = [
        {
          pattern: '**/*.md',
          urlPrefix: 'docs'
        }
      ];
    }

    if (!Array.isArray(docfyConfig.plugins)) {
      docfyConfig.plugins = [];
    }

    // Add default plugins
    const replaceInternalLinksWithDocfyLink = require('./plugins/replace-internal-links-with-docfy-link').default;
    const previewTemplate = require('./plugins/preview-template').default;
    const extractDemosToComponents = require('./plugins/extract-demos-to-components').default;
    
    docfyConfig.plugins.unshift(
      replaceInternalLinksWithDocfyLink,
      previewTemplate,
      extractDemosToComponents
    );

    if (!Array.isArray(docfyConfig.remarkPlugins)) {
      docfyConfig.remarkPlugins = [];
    }

    const remarkHbs = require('remark-hbs').default;
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

    docfyConfig.sources.forEach((source: any) => {
      if (typeof source.root === 'undefined') {
        source.root = path.join(root, 'docs');
      }
    });

    return docfyConfig;
  },

  // Re-enables caching of this addon, due to opting out
  // of the caching implicitly by specifying treeFor* methods
  cacheKeyForTree(treeType: string): string {
    switch (treeType) {
      case 'app':
      case 'addon': {
        this._ensureDocfyConfig();
        return cacheKeyForTree(treeType, this, [this.docfyConfig]);
      }
      default:
        return cacheKeyForTree(treeType, this);
    }
  },

  treeForApp(tree: Node): Node {
    const trees: Node[] = [this._super.treeForApp.call(this, tree)];
    if (isDeepAddonInstance(this)) {
      return trees[0];
    }

    this._ensureDocfyConfig();

    const inputs: InputNode[] = [new UnwatchedDir(this.project.root)];

    (this.docfyConfig as DocfyConfig).sources.forEach((item) => {
      if (item.root && item.root !== this.project.root) {
        inputs.push(item.root);
      }
    });

    const docfyTree = new DocfyBroccoli(inputs, this.docfyConfig);
    trees.push(docfyTree);

    (this.bridge as BroccoliBridge).fulfill('docfy-tree', docfyTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  treeForAddon(tree: Node): Node {
    const trees: Node[] = [this._super.treeForAddon.call(this, tree)];
    if (isDeepAddonInstance(this)) {
      return trees[0];
    }

    const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line
    const modulePrefix = this.project.config(EmberApp.env()).modulePrefix;

    trees.push(new WriteFile('output.js', docfyOutputTemplate(modulePrefix)));

    return new MergeTrees(trees);
  },

  treeForPublic(): Node | undefined {
    if (isDeepAddonInstance(this)) {
      return;
    }

    return new Funnel(
      (this.bridge as BroccoliBridge).placeholderFor('docfy-tree'),
      {
        srcDir: 'public',
        destDir: './'
      }
    );
  },

  urlsForPrember(distDir: string): string[] {
    try {
      return require(path.join(distDir, 'docfy-urls.json')); // eslint-disable-line
    } catch {
      // empty
    }
    return [];
  }
};
