import Docfy from '../src';
import { PageContent } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

function findPage(pages: PageContent[], source: string) {
  return pages.find((p) => {
    return p.source === source;
  });
}

describe('When urlSchema is set to manual', () => {
  describe('Basic case, no url prefix, or suffix', () => {
    let pages: PageContent[];

    beforeAll(async () => {
      const docfy = new Docfy();
      pages = await docfy.run([
        {
          root,
          urlSchema: 'manual',
          pattern: '**/*.md'
        }
      ]);
    });

    test('it should have collected all pages and moved demos', async () => {
      expect(pages.length).toBe(8);
      expect(
        findPage(pages, 'packages/package1/components/form/index.md').demos
          ?.length
      ).toBe(1);

      expect(
        findPage(pages, 'packages/package1/components/button.md').demos?.length
      ).toBe(1);
    });

    test('it should have generated urls based on frontmatter and should have used urlPrefix', async () => {
      const urls = [];
      pages.forEach((page) => {
        urls.push([page.source, page.metadata.url]);
      });

      expect(urls).toMatchSnapshot();
    });

    test('it should have extracted or infered the title', async () => {
      const titles = [];
      pages.forEach((page) => {
        titles.push([page.source, page.metadata.title]);
      });

      expect(titles).toMatchSnapshot();
    });

    test('it should have fixed the links between files', async () => {
      expect(
        findPage(pages, 'packages/package2/docs/overview.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(pages, 'packages/package2/docs/styles.md').rendered
      ).toMatchSnapshot();
    });
  });

  describe('When source defines url prefix and suffix', () => {
    let pages: PageContent[];

    beforeAll(async () => {
      const docfy = new Docfy();
      pages = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          urlSchema: 'manual',
          urlSuffix: '.html',
          pattern: '**/*.md'
        }
      ]);
    });

    test('it should have generated urls based on frontmatter and should have used urlPrefix', async () => {
      const urls = [];
      pages.forEach((page) => {
        urls.push([page.source, page.metadata.url]);
      });

      expect(urls).toMatchSnapshot();
    });

    test('it should have fixed the links between files', async () => {
      expect(
        findPage(pages, 'packages/package2/docs/overview.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(pages, 'packages/package2/docs/styles.md').rendered
      ).toMatchSnapshot();
    });
  });
});
