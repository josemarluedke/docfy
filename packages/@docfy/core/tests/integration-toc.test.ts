import Docfy from '../src';
import { Page } from '../src/types';
import path from 'path';
import autolinkHeadings from 'remark-autolink-headings';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Extracts TOC', () => {
  describe('When maxDepth is not set', () => {
    let pages: Page[];

    beforeAll(async () => {
      pages = await Docfy({
        root,
        sources: [
          {
            urlPrefix: 'docs',
            urlSchema: 'manual',
            pattern: '/**/*.md'
          }
        ],
        remarkPlugins: [autolinkHeadings]
      });
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
    let pages: Page[];

    beforeAll(async () => {
      pages = await Docfy({
        root,
        sources: [
          {
            urlPrefix: 'docs',
            urlSchema: 'manual',
            pattern: '/**/*.md'
          }
        ],
        remarkPlugins: [[autolinkHeadings, { behavior: 'append' }]],
        tocMaxDepth: 4
      });
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
