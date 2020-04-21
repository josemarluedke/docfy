import Docfy from '../src';
import { Page } from '../src/types';
import path from 'path';
import autolinkHeadings from 'remark-autolink-headings';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('When proving remark plugins', () => {
  describe('When plugin has no options', () => {
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

    test('it should have rendered the content with the plugin with no options', async () => {
      const htmls = [];
      pages.forEach((page) => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });

  describe('When plugin has options', () => {
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
        remarkPlugins: [[autolinkHeadings, { behavior: 'append' }]]
      });
    });

    test('it should have rendered the content with the plugin and their options', async () => {
      const htmls = [];
      pages.forEach((page) => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });
});
