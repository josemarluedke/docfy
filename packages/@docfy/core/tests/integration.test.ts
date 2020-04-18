import Docfy from '../src';
import { Page } from '../src/types';
import path from 'path';

function findPage(pages: Page[], source: string) {
  return pages.find((p) => {
    return p.source === source;
  });
}

describe('It works as expected for a monorepo ', () => {
  const root = path.resolve(__dirname, './fixtures/monorepo');
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
    expect(findPage(pages, 'docs/about.md').metadata.url).toBe('/docs/about');
    expect(findPage(pages, 'docs/how-it-works.md').metadata.url).toBe(
      '/docs/how-it-works'
    );
    expect(
      findPage(pages, 'packages/package1/components/button.md').metadata.url
    ).toBe('/docs/package1/components/button');
    expect(
      findPage(pages, 'packages/package1/components/form/index.md').metadata.url
    ).toBe('/docs/package1/components/form');
    expect(
      findPage(pages, 'packages/package1/docs/intro.md').metadata.url
    ).toBe('/docs/package1/intro');
    expect(
      findPage(pages, 'packages/package2/docs/overview.md').metadata.url
    ).toBe('/docs/package2/overview');
    expect(
      findPage(pages, 'packages/package2/docs/styles.md').metadata.url
    ).toBe('/docs/package2/styles');
  });

  test('it should have extracted or infered the title', async () => {
    expect(findPage(pages, 'docs/about.md').metadata.title).toBe(
      'About the project'
    );
    expect(findPage(pages, 'docs/how-it-works.md').metadata.title).toBe(
      'How it works?'
    );
    expect(
      findPage(pages, 'packages/package1/components/button.md').metadata.title
    ).toBe('Button Component');
    expect(
      findPage(pages, 'packages/package1/components/form/index.md').metadata
        .title
    ).toBe('Form Component');
    expect(
      findPage(pages, 'packages/package1/docs/intro.md').metadata.title
    ).toBe('Docs Intro');
    expect(
      findPage(pages, 'packages/package2/docs/overview.md').metadata.title
    ).toBe('Overview');
    expect(
      findPage(pages, 'packages/package2/docs/styles.md').metadata.title
    ).toBe('How styles work');
  });

  test('it should have fixed the links between files', async () => {
    expect(findPage(pages, 'packages/package2/docs/overview.md').rendered).toBe(
      '<h1>This is the overview page</h1>\n' +
        '<p>This is a <a href="/docs/package1/components/button">link to another file in a different package</a>.</p>\n'
    );
    expect(findPage(pages, 'packages/package2/docs/styles.md').rendered).toBe(
      '<h1>How styles work</h1>\n' +
        '<p>Short description.</p>\n' +
        '<p>Please refer to <a href="/docs/package2/overview">overview</a> to get started.</p>\n'
    );
  });
});
