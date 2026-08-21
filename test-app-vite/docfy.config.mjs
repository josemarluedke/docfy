import path from 'path';
import { fileURLToPath } from 'url';
import autolinkHeadings from 'rehype-autolink-headings';
import highlight from 'rehype-highlight';
import codeImport from 'remark-code-import';
import { glimmer } from 'highlightjs-glimmer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  repository: {
    url: 'https://github.com/josemarluedke/docfy',
    editBranch: 'main',
  },
  tocMaxDepth: 3,
  remarkPlugins: [codeImport],
  rehypePlugins: [
    [autolinkHeadings, { behavior: 'wrap' }],
    [
      highlight,
      {
        languages: { glimmer, hbs: glimmer, handlebars: glimmer },
        aliases: { javascript: ['gjs'], typescript: ['gts'] },
      },
    ],
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
