import Docfy from '../src';
import { DocfyResult } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Extracts TOC', () => {
  describe('When maxDepth is not set', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy();
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          urlSchema: 'manual',
          pattern: '**/*.md'
        }
      ]);
    });

    test('it should have extracted TOC correctly', async () => {
      const TOCs = [];
      result.content.forEach((page) => {
        TOCs.push([page.source, page.meta.headings]);
      });

      expect(TOCs).toMatchSnapshot();
    });
  });

  describe('When maxDepth is set', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy({ tocMaxDepth: 4 });
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          urlSchema: 'manual',
          pattern: '**/*.md'
        }
      ]);
    });

    test('it should have extracted TOC correctly', async () => {
      const TOCs = [];
      result.content.forEach((page) => {
        TOCs.push([page.source, page.meta.headings]);
      });

      expect(TOCs).toMatchSnapshot();
    });
  });
});
