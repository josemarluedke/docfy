'use strict';

// Enable FastBoot Rehydration
process.env.EXPERIMENTAL_RENDER_MODE_SERIALIZE = true;

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

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
      exclude: ['fastboot/**']
    });
  }

  const app = new EmberAddon(defaults, {
    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.css$/, /.tailwind\.config\.js$/],
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: [path.join(__dirname, '../../../node_modules')]
            }
          },
          require('tailwindcss')(
            path.join('tests', 'dummy', 'app', 'styles', 'tailwind.config.js')
          ),
          require('postcss-nested'),
          require('autoprefixer')
        ]
      }
    },
    trees,
    addons: {
      blacklist: process.env.FASTBOOT_DISABLED
        ? ['ember-cli-fastboot-testing']
        : []
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  if (process.env.EMBROIDER) {
    const { Webpack } = require('@embroider/webpack');
    return require('@embroider/compat').compatBuild(app, Webpack, {
      staticAddonTestSupportTrees: true,
      staticAddonTrees: true,
      staticHelpers: true,
      staticComponents: true
    });
  }

  return app.toTree();
};
