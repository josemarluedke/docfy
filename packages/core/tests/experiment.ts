import Docfy from '../src';
import path from 'path';
import hbs from 'remark-hbs';
import autolinkHeadings from 'remark-autolink-headings';

const projectRoot = '../tests/__fixtures__/monorepo/';
// const projectRoot = '../../../../../frontile/';
const root = path.resolve(__dirname, projectRoot);

(async function (): Promise<void> {
  const docfy = new Docfy({
    remarkPlugins: [[autolinkHeadings, { behavior: 'append' }], hbs],
    repository: {
      url: 'https://github.com/josemarluedke/docfy'
    }
  });

  const { content } = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      urlSchema: 'manual',
      pattern: '**/*.md',
      ignore: ['**/package1/**/*.md']
    },
    {
      root,
      urlPrefix: 'blog',
      urlSchema: 'manual',
      pattern: '**/**/package1/**/*.md',
      repository: {
        url: 'https://github.com/user/repo'
      }
    }
  ]);

  console.log(content);
})();
