import Docfy from '../src';
import { DocfyResult } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Generates runtime output', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      tocMaxDepth: 2,
      repository: {
        url: 'https://github.com/user/repo',
      },
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);
  });

  test('it should have generated the nestedPageMetadata', () => {
    expect(result.nestedPageMetadata).toMatchSnapshot();
  });
});
