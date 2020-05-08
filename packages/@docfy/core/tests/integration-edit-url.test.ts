import Docfy from '../src';
import { DocfyResult } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Generates Edit Url', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      repository: {
        url: 'https://github.com/user/repo',
        editBranch: 'dev'
      }
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
        ignore: ['**/package2/**/*.md']
      },
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/package2/**/*.md',
        repository: {
          url: 'https://bitbucket.org/user/repo'
        }
      }
    ]);
  });

  test('it should generated edit urls correctly', async () => {
    const urls = [];
    result.content.forEach((page) => {
      urls.push([page.source, page.meta.editUrl]);
    });

    expect(urls).toMatchSnapshot();
  });
});
