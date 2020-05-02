const autolinkHeadings = require('remark-autolink-headings');

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
      pattern: 'dummy-docs/**/*.md',
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
