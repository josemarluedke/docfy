'use strict';

// Enable FastBoot Rehydration
process.env.EXPERIMENTAL_RENDER_MODE_SERIALIZE = true;

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

if (process.env.EMBROIDER) {
  process.env.FASTBOOT_DISABLED = true;
}

module.exports = function (defaults) {
  const trees = {};

  // Exclude FastBoot tests if FASTBOOT_DISABLED is set,
  // to enable FASTBOOT_DISABLED tests until https://github.com/embroider-build/embroider/issues/160 is resolved.
  if (process.env.FASTBOOT_DISABLED) {
    const Funnel = require('broccoli-funnel');
    trees.tests = new Funnel('tests', {
      exclude: ['fastboot/**'],
    });
  }

  const app = new EmberAddon(defaults, {});

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  if (process.env.EMBROIDER) {
    const { Webpack } = require('@embroider/webpack');
    const compiledApp = require('@embroider/compat').compatBuild(app, Webpack, {
      staticAddonTestSupportTrees: true,
      staticAddonTrees: true,
      staticHelpers: true,
      staticComponents: true,
    });

    return require('prember').prerender(app, compiledApp);
  }

  return app.toTree();
};
