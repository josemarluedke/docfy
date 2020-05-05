'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.hbs$/, /.*\.css$/, /.tailwind\.config\.js$/],
        plugins: [
          require('tailwindcss')(
            path.join('tests', 'dummy', 'app', 'styles', 'tailwind.config.js')
          ),
          require('postcss-nested'),
          require('autoprefixer')
        ]
      }
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
