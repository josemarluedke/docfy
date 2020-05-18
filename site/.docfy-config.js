const path = require('path');
const autolinkHeadings = require('remark-autolink-headings');
const highlight = require('remark-highlight.js');
const codeImport = require('remark-code-import');

module.exports = {
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap'
      }
    ],
    codeImport,
    highlight
  ],
  sources: [
    {
      root: path.resolve(__dirname, '../docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs'
    },
    {
      root: path.resolve(__dirname, '../packages/@docfy/ember/docs'),
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs/ember'
    }
  ],
  labels: {
    components: 'Components',
    core: '@docfy/core',
    ember: '@docfy/ember',
    docs: 'Documentation'
  }
};
