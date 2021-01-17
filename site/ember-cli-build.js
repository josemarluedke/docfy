'use strict';

// Enable FastBoot Rehydration
process.env.EXPERIMENTAL_RENDER_MODE_SERIALIZE = true;

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');
const env = EmberApp.env();

const purgecssOptions = {
  content: [
    './app/index.html',
    './app/**/*.hbs',
    '../**/*.md',
    './node_modules/**/*.hbs',
    '../node_modules/**/*.hbs'
  ],
  defaultExtractor: (content) => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

    return broadMatches.concat(innerMatches);
  },
  whitelistPatterns: [/js-/, /mode-dark/]
};

const postcssPlugins = [
  {
    module: require('postcss-import'),
    options: {
      path: [path.join(__dirname, '../node_modules')]
    }
  },
  require('tailwindcss')(path.join('app', 'styles', 'tailwind.config.js')),
  require('postcss-nested'),
  require('autoprefixer')
];
if (env !== 'development' || process.env.PURGE_CSS === 'true') {
  const purgecss = require('@fullhuman/postcss-purgecss')(purgecssOptions);
  postcssPlugins.push(purgecss);
}

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-inline-css': {
      filter:
        env === 'development' ? [] : ['/assets/vendor.css', '/assets/site.css']
    },
    prember: {
      urls: ['/']
    },
    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.css$/, /.tailwind\.config\.js$/],
        plugins: postcssPlugins
      }
    }
  });

  if (process.env.CLASSIC) {
    return app.toTree();
  }

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticComponents: true
  });
};
