import path from 'path';
import { fileURLToPath } from 'url';
import autolinkHeadings from 'rehype-autolink-headings';
import highlight from 'rehype-highlight';
import codeImport from 'remark-code-import';
import { glimmer } from 'highlightjs-glimmer';
import { common } from 'lowlight';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  repository: {
    url: 'https://github.com/josemarluedke/docfy',
    editBranch: 'main',
  },
  tocMaxDepth: 3,
  remarkPlugins: [
    // The docs live in ../docs, outside this app. remark-code-import v1 refuses
    // to read files outside `rootDir` (default: cwd), so point it at the repo.
    [codeImport, { rootDir: path.join(__dirname, '..') }],
  ],
  rehypePlugins: [
    [autolinkHeadings, { behavior: 'wrap' }],
    [
      highlight,
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
      root: path.join(__dirname, '../docs'),
      pattern: '**/*.md',
      // `docs/superpowers/` holds working documents for in-flight work (plans
      // and design specs), not published documentation. Ignored as a directory
      // so anything added there later stays unpublished too.
      ignore: ['superpowers/**'],
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
