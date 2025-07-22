'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },

    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.css$/, /.tailwind\.config\.js$/],
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: [path.join(__dirname, '../node_modules')],
            },
          },
          require('tailwindcss')(
            path.join('app', 'styles', 'tailwind.config.js'),
          ),
          require('postcss-nested'),
          require('autoprefixer'),
        ],
      },
    },

    // Add options here
  });

  return app.toTree();
};
