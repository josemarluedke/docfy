// A CommonJS config file that pulls in ESM-only remark/rehype plugins.
// This works because Node (>= 20.19 / >= 22.12) supports `require()` of ES
// modules, so no `.mjs` config or dynamic `import()` is needed here.
const path = require('path');
const autolinkHeadings = require('rehype-autolink-headings');
const highlight = require('rehype-highlight');
const docfyWithProse = require('@docfy/plugin-with-prose');
const { glimmer } = require('highlightjs-glimmer');
const { common } = require('lowlight');

module.exports = {
  plugins: [docfyWithProse.default],
  rehypePlugins: [
    [autolinkHeadings.default, { behavior: 'wrap' }],
    [
      highlight.default,
      {
        // `languages` replaces rehype-highlight's default set, so spread
        // lowlight's `common` back in or everything else stops highlighting.
        languages: { ...common, glimmer, hbs: glimmer, handlebars: glimmer },
        aliases: { javascript: ['gjs'], typescript: ['gts'] },
      },
    ],
  ],
  sources: [
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs',
    },
  ],
  labels: {
    components: 'Components',
    plugins: 'Plugins',
    helpers: 'Helpers',
    core: '@docfy/core',
    ember: '@docfy/ember',
    docs: 'Documentation',
  },
};
