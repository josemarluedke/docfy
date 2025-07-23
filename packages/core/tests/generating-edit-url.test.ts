import Docfy from '../src';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

test('it should correctly generate edit urls', async () => {
  const docfy = new Docfy({
    repository: {
      url: 'https://github.com/user/repo',
      editBranch: 'dev',
    },
  });
  const result = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      urlSchema: 'manual',
      pattern: '**/*.md',
      ignore: ['**/package2/**/*.md'],
    },
    {
      root,
      urlPrefix: 'docs',
      urlSchema: 'manual',
      pattern: '**/package2/**/*.md',
      repository: {
        url: 'https://bitbucket.org/user/repo',
      },
    },
  ]);

  const urls = [];
  result.content.forEach(page => {
    urls.push([page.source, page.meta.editUrl]);
  });

  expect(urls).toMatchSnapshot();
});
