import fs from 'fs';
import path from 'path';
import MergeTrees from 'broccoli-merge-trees';
import Plugin from 'broccoli-plugin';
import Docfy from '@docfy/core';
import { DocfyConfig, SourceSettings } from '@docfy/core/dist/types';
import writeFile from 'broccoli-file-creator';
const UnwatchedDir = require('broccoli-source').UnwatchedDir;
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

function ensureDirectoryExistence(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function isValidConfig(config: unknown): config is DocfyConfig {
  return typeof config === 'object';
}

// TODO
function getValidConfig(
  defaultRoot: string,
  configToValidate: unknown
): DocfyConfig {
  let config = configToValidate;

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

  (config as DocfyConfig).sources.forEach((source) => {
    if (typeof source.root === 'undefined') {
      source.root = defaultRoot;
    }
  });

  return config as DocfyConfig;
}

class DocfyBroccoli extends Plugin {
  config: DocfyConfig;

  constructor(inputNodes: string[], options = {}) {
    super(inputNodes, options);
    this.config = options as DocfyConfig;
  }

  async build(): Promise<void> {
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
  name: require('../package').name,

  docfyConfig: undefined,

  included(): void {
    const configPath = path.join(this.project.root, '.docfy-config.js');

    try {
      this.docfyConfig = require(configPath);
    } catch (e) {
      if (!e.message.match(new RegExp(`Cannot find module .${configPath}`))) {
        throw e;
      }
    }
    this.docfyConfig = getValidConfig(this.project.root, this.docfyConfig);
  },

  treeForApp(app: unknown): unknown {
    const trees: unknown[] = [];

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

  treeForAddon(tree): unknown {
    const EmberApp = require('ember-cli/lib/broccoli/ember-app'); // eslint-disable-line node/no-unpublished-require, @typescript-eslint/no-var-requires
    const modulePrefix = this.project.config(EmberApp.env()).modulePrefix;

    const trees: unknown[] = [];
    if (tree) {
      trees.push(tree);
    }

    trees.push(
      writeFile(
        'docfy-output.js',
        `;define("@docfy/output", ["exports", "${modulePrefix}/docfy-output"], function (_exports, _docfyOutput) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _docfyOutput.default;
    }
  });
});`
      )
    );

    return new MergeTrees(trees);
  }
};
