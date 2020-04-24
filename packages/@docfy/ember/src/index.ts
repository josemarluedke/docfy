import fs from 'fs';
import path from 'path';
import MergeTrees from 'broccoli-merge-trees';
import Plugin from 'broccoli-plugin';
import Docfy from '@docfy/core';
import { DocfyConfig, SourceSettings } from '@docfy/core/dist/types';
// const UnwatchedDir = require('broccoli-source').UnwatchedDir;
// const Funnel = require('broccoli-funnel');
// const walkSync = require('walk-sync');
// const stew = require('broccoli-stew');
//
//
//
//
// TODO:
//
// - Figure out where docfy.js should go.
// - Fix internal urls, generate a component DocfyLink
// - Write plugin to replace internal links with DocfyLink
// - Generate menu, with categories.
// - Order menu
// - Component to get previous and next page link
// - Edit this page link ?

const DEFAULT_CONFIG: DocfyConfig = {
  sources: [
    {
      pattern: '/docs/**/*.md'
    }
  ]
};

function isValidConfig(config: unknown): config is DocfyConfig {
  return typeof config === 'object';
}

class DocfyBroccoli extends Plugin {
  config: DocfyConfig;

  constructor(inputNodes: string[], options = {}) {
    super(inputNodes, options);
    let config = options as unknown;

    if (isValidConfig(config)) {
      if (typeof config.sources === 'undefined') {
        config.sources = DEFAULT_CONFIG.sources;
      }

      if (!Array.isArray(config.sources)) {
        console.warn(
          'Docfy expected an array for sources in .docfy-config.js, received ',
          typeof config.sources
        );

        config.sources = DEFAULT_CONFIG.sources;
      }
    } else {
      config = DEFAULT_CONFIG;
    }

    this.config = config as DocfyConfig;
  }

  async build(): Promise<void> {
    this.config.sources.forEach((source) => {
      if (typeof source.root === 'undefined') {
        source.root = this.inputPaths[0];
      }
    });

    const docfy = new Docfy(this.config);
    const pages = await docfy.run(this.config.sources as SourceSettings[]);

    const docfyOutput = pages.map((item) => {
      const { url, headings, title, metadata } = item;
      return {
        url,
        headings,
        title,
        metadata
      };
    });

    console.log();
    console.log('Docfy Output: ', this.outputPath);

    pages.forEach((page) => {
      const fileName = path.basename(page.url);

      const folder = path
        .join(this.outputPath, 'templates', page.url)
        .replace(fileName, '');

      fs.mkdirSync(folder, { recursive: true });

      fs.writeFileSync(path.join(folder, `${fileName}.hbs`), page.rendered);
    });

    fs.writeFileSync(
      path.join(this.outputPath, 'docfy.js'),
      `export default ${JSON.stringify(docfyOutput)}`
    );
  }
}

module.exports = {
  name: require('../package').name,

  docfyConfig: DEFAULT_CONFIG,

  included(): void {
    const configPath = path.join(this.project.root, '.docfy-config.js');

    try {
      this.docfyConfig = require(configPath);
    } catch (e) {
      if (!e.message.match(new RegExp(`Cannot find module .${configPath}`))) {
        throw e;
      }
    }
  },

  treeForApp(app: unknown): unknown {
    const trees: unknown[] = [];

    if (app) {
      trees.push(app);
    }

    trees.push(new DocfyBroccoli([this.project.root], this.docfyConfig));

    return new MergeTrees(trees, { overwrite: true });
  }
};
