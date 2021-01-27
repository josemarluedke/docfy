const path = require('path');
const autolinkHeadings = require('remark-autolink-headings');
const highlight = require('remark-highlight.js');
const prism = require('@mapbox/rehype-prism');
const refractor = require('refractor');

refractor.alias('handlebars', 'hbs');
refractor.alias('shell', 'sh');

module.exports = {
  remarkHbsOptions: {
    escapeCurliesCode: false
  },
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap'
      }
    ]
  ],
  rehypePlugins: [prism],
  sources: [
    {
      root: path.join(__dirname, 'dummy-docs'),
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs'
    }
  ],
  labels: {
    components: 'Components',
    helpers: 'Helpers',
    core: '@docfy/core',
    ember: '@docfy/ember',
    docs: 'Documentation'
  }
};
