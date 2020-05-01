import Docfy from '../src';
import { PageContent } from '../src/types';
import { generateRuntimeOutput } from '../src/runtime-output';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Generates runtime output', () => {
  let pages: PageContent[];

  beforeAll(async () => {
    const docfy = new Docfy({
      tocMaxDepth: 2,
      repository: {
        url: 'https://github.com/user/repo'
      }
    });
    pages = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '/**/*.md'
      }
    ]);
  });

  test('it should have generated the runtime output', async () => {
    expect(generateRuntimeOutput(pages)).toMatchSnapshot();
  });
});
