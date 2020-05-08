import Docfy from '../src';
import { PageContent } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Extracts TOC', () => {
  describe('When maxDepth is not set', () => {
    let pages: PageContent[];

    beforeAll(async () => {
      const docfy = new Docfy();
      pages = await docfy.run([
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
      pages.forEach((page) => {
        TOCs.push([page.source, page.metadata.headings]);
      });

      expect(TOCs).toMatchSnapshot();
    });
  });

  describe('When maxDepth is set', () => {
    let pages: PageContent[];

    beforeAll(async () => {
      const docfy = new Docfy({ tocMaxDepth: 4 });
      pages = await docfy.run([
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
      pages.forEach((page) => {
        TOCs.push([page.source, page.metadata.headings]);
      });

      expect(TOCs).toMatchSnapshot();
    });
  });
});
