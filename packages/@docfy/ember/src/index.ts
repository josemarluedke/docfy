import fs from 'fs';
import path from 'path';
import MergeTrees from 'broccoli-merge-trees';
import { Node, InputNode } from 'broccoli-node-api';
import Plugin from 'broccoli-plugin';
import Docfy from '@docfy/core';
import { generateRuntimeOutput } from '@docfy/core/dist/runtime-output';
import { DocfyConfig, SourceSettings } from '@docfy/core/dist/types';
import WriteFile from 'broccoli-file-creator';
import { UnwatchedDir } from 'broccoli-source';
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
      const fileName = `${path.join(
        this.outputPath,
        'templates',
        page.url
      )}.hbs`;

      ensureDirectoryExistence(fileName);
      fs.writeFileSync(fileName, page.rendered);
    });

    fs.writeFileSync(
      path.join(this.outputPath, 'docfy-output.js'),
      `export default ${JSON.stringify(
        generateRuntimeOutput(pages, this.config.labels)
      )};`
    );
  }
}

module.exports = {
  name: require('../package').name, // eslint-disable-line @typescript-eslint/no-require-imports

  docfyConfig: undefined,

  included(...args: unknown[]): void {
    this.docfyConfig = getDocfyConfig(this.project.root);

    this._super.included.apply(this, args);
  },

  treeForApp(tree: InputNode): Node {
    const trees: InputNode[] = [this._super.treeForApp.call(this, tree)];

    const docfyTree = new DocfyBroccoli(
      [new UnwatchedDir(this.project.root)],
      this.docfyConfig
    );

    trees.push(docfyTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  treeForAddon(tree: InputNode): Node {
    const trees: InputNode[] = [this._super.treeForAddon.call(this, tree)];
    const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line
    const modulePrefix = this.project.config(EmberApp.env()).modulePrefix;

    trees.push(
      new WriteFile('docfy-output.js', docfyOutputTemplate(modulePrefix))
    );

    return new MergeTrees(trees);
  }
};
