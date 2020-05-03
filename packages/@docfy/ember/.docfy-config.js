const autolinkHeadings = require('remark-autolink-headings');
const path = require('path');

module.exports = {
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap'
      }
    ]
  ],
  sources: [
    {
      root: path.resolve(__dirname, './dummy-docs') + '/',
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
