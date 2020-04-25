const hbs = require('remark-hbs');
const autolinkHeadings = require('remark-autolink-headings');

module.exports = {
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap'
      }
    ],
    hbs
  ],
  sources: [
    {
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs'
    }
  ]
};