import {
  generateManualUrl,
  generateAutoUrl,
  isAnchorUrl,
  isValidUrl,
  inferTitle,
  parseFrontmatter
} from '../src/utils';
import { createRemark } from '../src/remark';

describe('#generateManualUrl', () => {
  test('base case', () => {
    expect(generateManualUrl('cool/markdown.md', {})).toBe('/markdown');
  });

  test('it uses subcategory from metadata', () => {
    expect(
      generateManualUrl('cool/markdown.md', { subcategory: 'components' })
    ).toBe('/components/markdown');
  });

  test('it uses category from metadata', () => {
    expect(
      generateManualUrl('cool/markdown.md', { category: 'awesome-lib' })
    ).toBe('/awesome-lib/markdown');
  });

  test('it uses category and subcategory from metadata', () => {
    expect(
      generateManualUrl('cool/markdown.md', {
        category: 'awesome-lib',
        subcategory: 'helpers'
      })
    ).toBe('/awesome-lib/helpers/markdown');
  });

  test('it passes category and subcategory into slug', () => {
    expect(
      generateManualUrl('cool/markdown.md', {
        category: '@org/awesome-lib',
        subcategory: 'helpers and modifiers'
      })
    ).toBe('/orgawesome-lib/helpers-and-modifiers/markdown');
  });

  test('it uses folder name if fine is called index', () => {
    expect(generateManualUrl('cool/button/index.md', {})).toBe('/button');
  });

  test('it adds the prefix', () => {
    expect(generateManualUrl('cool/button/index.md', {}, 'docs')).toBe(
      '/docs/button'
    );
  });

  test('it adds the sufifx', () => {
    expect(generateManualUrl('cool/button/index.md', {}, 'docs', '.html')).toBe(
      '/docs/button.html'
    );
  });

  test('it lower cases the url', () => {
    expect(generateManualUrl('cool/Button/README.md', {}, 'docs')).toBe(
      '/docs/readme'
    );
  });
});

describe('#generateAutolUrl', () => {
  test('base case', () => {
    expect(generateAutoUrl('my-folder/file.md')).toBe('/my-folder/file');
    expect(generateAutoUrl('my-folder/subfolder/file.md')).toBe(
      '/my-folder/subfolder/file'
    );
    expect(generateAutoUrl('my-folder/subfolder/another-folder/file.md')).toBe(
      '/my-folder/subfolder/another-folder/file'
    );
  });

  test('it uses folder name if fine is called index', () => {
    expect(generateAutoUrl('my-folder/components/index.md')).toBe(
      '/my-folder/components'
    );
  });

  test('it adds the prefix', () => {
    expect(generateAutoUrl('my-folder/file.md', 'docs')).toBe(
      '/docs/my-folder/file'
    );
  });

  test('it adds the sufifx', () => {
    expect(generateAutoUrl('my-folder/file.md', 'docs', '.html')).toBe(
      '/docs/my-folder/file.html'
    );
  });

  test('it lower cases the url', () => {
    expect(generateAutoUrl('docs/Button/README.md')).toBe(
      '/docs/button/readme'
    );
  });
});

test('#isAnchorUrl', () => {
  expect(isAnchorUrl('#test')).toBe(true);
  expect(isAnchorUrl('../test')).toBe(false);
  expect(isAnchorUrl('https://google.com')).toBe(false);
});

test('#isValidUrl', () => {
  expect(isValidUrl('#test')).toBe(false);
  expect(isValidUrl('../test')).toBe(false);
  expect(isValidUrl('https://google.com')).toBe(true);
});

describe('#inferTitle', () => {
  test('it returns heading depth 1 as title', () => {
    const markdown =
      '# this is the title\n Something else \n## Another heading';

    const ast = createRemark().parse(markdown);
    expect(inferTitle(ast)).toBe('this is the title');
  });

  test('it returns undefined if no heading depth 1 is found', () => {
    const markdown = 'Something here';

    const ast = createRemark().parse(markdown);
    expect(inferTitle(ast)).toBe(undefined);
  });
});

describe('#parseFrontmatter', () => {
  test('it returns an object with parsed frontmatter', () => {
    const markdown = '---\ntitle: My Title\nsubcategory: test\n---\n\n# test\n';
    const remark = createRemark();
    const ast = remark.runSync(remark.parse(markdown));
    const result = parseFrontmatter('my-file.md', ast);

    expect(result).toEqual({
      title: 'My Title',
      subcategory: 'test'
    });
  });
});
