const path = require('path');

module.exports = {
  sources: [
    {
      root: path.join(__dirname, '../docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs'
    },
    {
      root: path.resolve(__dirname, '../packages/ember/docs'),
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
