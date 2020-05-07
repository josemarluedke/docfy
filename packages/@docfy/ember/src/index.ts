import fs from 'fs';
import path from 'path';
import BroccoliBridge from 'broccoli-bridge';
import Funnel from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Plugin from 'broccoli-plugin';
import WriteFile from 'broccoli-file-creator';
import { Node, InputNode } from 'broccoli-node-api';
import { UnwatchedDir } from 'broccoli-source';
import Docfy, { transformOutput } from '@docfy/core';
import { DocfyConfig, SourceSettings } from '@docfy/core/lib/types';
import docfyOutputTemplate from './docfy-output-template';
import getDocfyConfig from './get-config';

function ensureDirectoryExistence(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

class DocfyBroccoli extends Plugin {
  config: DocfyConfig;

  constructor(inputNodes: InputNode[], options = {}) {
    super(inputNodes, options);
    this.config = options as DocfyConfig;
  }

  async build(): Promise<void> {
    const docfy = new Docfy(this.config);
    const pages = await docfy.run(this.config.sources as SourceSettings[]);

    pages.forEach((page) => {
      const parts = [this.outputPath, 'templates', page.url];

      if (page.url[page.url.length - 1] === '/') {
        parts.push('index');
      }

      const fileName = `${path.join(...parts)}.hbs`;

      ensureDirectoryExistence(fileName);
      fs.writeFileSync(fileName, page.rendered);
    });

    fs.writeFileSync(
      path.join(this.outputPath, 'docfy-output.js'),
      `export default ${JSON.stringify(
        transformOutput(pages, this.config.labels)
      )};`
    );

    const urlsJsonFile = path.join(
      this.outputPath,
      'public',
      'docfy-urls.json'
    );
    ensureDirectoryExistence(urlsJsonFile);
    fs.writeFileSync(
      urlsJsonFile,
      JSON.stringify(pages.map((page) => page.url))
    );
  }
}

module.exports = {
  name: require('../package').name, // eslint-disable-line @typescript-eslint/no-require-imports

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
