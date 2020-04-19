import Docfy from '../src';
import { Page } from '../src/types';
import path from 'path';

function findPage(pages: Page[], source: string) {
  return pages.find((p) => {
    return p.source === source;
  });
}

describe('It works as expected for a monorepo ', () => {
  const root = path.resolve(__dirname, './__fixtures__/monorepo');
  let pages: Page[];

  beforeAll(async () => {
    pages = await Docfy({
      root,
      sources: [
        {
          urlPrefix: 'docs',
          pattern: '{/**/docs/**/*.md,/**/**/*.md,/**/addon/**/*.md}'
        }
      ]
    });
  });

  test('it should have collected all pages and moved demos', async () => {
    expect(pages.length).toBe(7);
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
