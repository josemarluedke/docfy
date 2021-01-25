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
import debugFactory from 'debug';
const debug = debugFactory('@docfy/ember');

const templateOnlyComponent = `
import templateOnly from '@ember/component/template-only';
export default templateOnly();
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

    if (chunk.ext === 'js' || chunk.ext === 'ts') {
      return true;
    }
  }
  return false;
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

    result.content.forEach((page) => {
      const parts = [this.outputPath, 'templates', page.meta.url];

      if (page.meta.url[page.meta.url.length - 1] === '/') {
        parts.push('index');
      }

      const fileName = `${path.join(...parts)}.hbs`;

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
            fs.writeFileSync(chunkPath, chunk.code);
          });

          if (!hasBackingJS(component.chunks)) {
            const chunkPath = path.join(
              this.outputPath,
              'components',
              `${component.name.dashCase}.js`
            );
            ensureDirectoryExistence(chunkPath);
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
    result.staticAssets.forEach((asset) => {
      const dest = path.join(this.outputPath, 'public', asset.toPath);
      ensureDirectoryExistence(dest);
      fs.copyFileSync(asset.fromPath, dest);
    });
  }
}

module.exports = {
  name: require('../package').name, // eslint-disable-line @typescript-eslint/no-var-requires

  docfyConfig: undefined,

  included(...args: unknown[]): void {
    this.docfyConfig = getDocfyConfig(this.project.root);

    this.bridge = new BroccoliBridge();
    this._super.included.apply(this, args);
  },

  treeForApp(tree: InputNode): Node {
    const trees: InputNode[] = [this._super.treeForApp.call(this, tree)];

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

  treeForAddon(tree: InputNode): Node {
    const trees: InputNode[] = [this._super.treeForAddon.call(this, tree)];
    const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line
    const modulePrefix = this.project.config(EmberApp.env()).modulePrefix;

    trees.push(new WriteFile('output.js', docfyOutputTemplate(modulePrefix)));

    return new MergeTrees(trees);
  },

  treeForPublic(): Node {
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
