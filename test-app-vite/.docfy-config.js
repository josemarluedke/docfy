const path = require('path');

module.exports = {
  sources: [
    {
      root: path.join(__dirname, '../docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs'
    }
  ],
  labels: {
    docs: 'Documentation'
  }
};