import Docfy from '../src';
import { PageContent, DocfyResult } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

function findPage(content: PageContent[], source: string) {
  return content.find((p) => {
    return p.source === source;
  });
}

describe('When urlSchema is set to manual', () => {
  describe('Basic case, no url prefix, or suffix', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy();
      result = await docfy.run([
        {
          root,
          urlSchema: 'manual',
          pattern: '**/*.md'
        }
      ]);
    });

    test('it should have collected all result.content and moved demos', async () => {
      expect(result.content.length).toBe(10);
      expect(
        findPage(result.content, 'packages/package1/components/form/index.md')
          .demos?.length
      ).toBe(2);

      expect(
        findPage(result.content, 'packages/package1/components/button.md').demos
          ?.length
      ).toBe(2);
    });

    test('it has sorted demos', async () => {
      const demos: string[] = [];

      findPage(
        result.content,
        'packages/package1/components/button.md'
      ).demos.forEach((demo) => {
        demos.push(demo.meta.title);
      });

      expect(demos).toMatchSnapshot();
    });

    test('it should have generated urls based on frontmatter and should have used urlPrefix', async () => {
      const urls = [];
      result.content.forEach((page) => {
        urls.push([page.source, page.meta.url]);
      });

      expect(urls).toMatchSnapshot();
    });

    test('it should have extracted or infered the title', async () => {
      const titles = [];
      result.content.forEach((page) => {
        titles.push([page.source, page.meta.title]);
      });

      expect(titles).toMatchSnapshot();
    });

    test('it should have fixed the links between files', async () => {
      expect(
        findPage(result.content, 'docs/how-it-works.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(result.content, 'packages/package2/docs/overview.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(result.content, 'packages/package2/docs/styles.md').rendered
      ).toMatchSnapshot();
    });
  });

  describe('When source defines url prefix and suffix', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy();
      result = await docfy.run([
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
      result.content.forEach((page) => {
        urls.push([page.source, page.meta.url]);
      });

      expect(urls).toMatchSnapshot();
    });

    test('it should have fixed the links between files', async () => {
      expect(
        findPage(result.content, 'docs/how-it-works.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(result.content, 'packages/package2/docs/overview.md').rendered
      ).toMatchSnapshot();
      expect(
        findPage(result.content, 'packages/package2/docs/styles.md').rendered
      ).toMatchSnapshot();
    });
  });
});
