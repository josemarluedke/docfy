'use strict';

// Enable FastBoot Rehydration
process.env.EXPERIMENTAL_RENDER_MODE_SERIALIZE = true;

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');


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
  return app.toTree();
};
