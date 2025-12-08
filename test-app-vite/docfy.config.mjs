import path from 'path';
import { fileURLToPath } from 'url';
import autolinkHeadings from 'remark-autolink-headings';
import highlight from 'remark-highlight.js';
import codeImport from 'remark-code-import';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  repository: {
    url: 'https://github.com/josemarluedke/docfy',
    editBranch: 'main',
  },
  tocMaxDepth: 3,
  remarkPlugins: [
    [
      autolinkHeadings,
      {
        behavior: 'wrap',
      },
    ],
    codeImport,
    highlight,
  ],
  sources: [
    {
      root: path.join(__dirname, '../docs'),
      pattern: '**/*.md',
      urlPrefix: 'docs',
    },
  ],
  sections: {
    docs: { label: 'Documentation', order: 1 },
    components: { label: 'Components', order: 2 },
    core: { label: '@docfy/core', order: 3 },
    ember: { label: 'Ember', order: 4 },
  },
};
