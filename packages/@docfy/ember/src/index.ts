import fs from 'fs';
import path from 'path';
import MergeTrees from 'broccoli-merge-trees';
import { Node, InputNode } from 'broccoli-node-api';
import Plugin from 'broccoli-plugin';
import Docfy from '@docfy/core';
import { DocfyConfig, SourceSettings } from '@docfy/core/dist/types';
import WriteFile from 'broccoli-file-creator';
import { UnwatchedDir } from 'broccoli-source';
import docfyOutputTemplate from './docfy-output-template';
import getDocfyConfig from './get-config';

// TODO:
//
// - Fix internal urls, generate a component DocfyLink
// - Write plugin to replace internal links with DocfyLink
// - Generate menu, with categories.
// - Order menu
// - Component to get previous and next page link
// - Edit this page link ?

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

    const docfyOutput = pages.map((item) => {
      const { url, headings, title, source, metadata } = item;
      return {
        url,
        headings,
        title,
        source,
        metadata
      };
    });

    console.log();
    console.log('Docfy Outpu Patht: ', this.outputPath);
    console.log();

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
      `export default ${JSON.stringify(docfyOutput)};`
    );
  }
}

module.exports = {
  name: require('../package').name, // eslint-disable-line @typescript-eslint/no-require-imports

  docfyConfig: undefined,

  included(): void {
    const configPath = path.join(this.project.root, '.docfy-config.js');
    this.docfyConfig = getDocfyConfig(configPath, this.project.root);
  },

  treeForApp(app: InputNode): Node {
    const trees: InputNode[] = [];

    if (app) {
      trees.push(app);
    }

    const docfyTree = new DocfyBroccoli(
      [new UnwatchedDir(this.project.root)],
      this.docfyConfig
    );

    trees.push(docfyTree);

    return new MergeTrees(trees, { overwrite: true });
  },

  treeForAddon(tree: InputNode): Node {
    const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line
    const modulePrefix = this.project.config(EmberApp.env()).modulePrefix;

    const trees: InputNode[] = [];
    if (tree) {
      trees.push(tree);
    }

    trees.push(
      new WriteFile('docfy-output.js', docfyOutputTemplate(modulePrefix))
    );

    return new MergeTrees(trees);
  }
};
