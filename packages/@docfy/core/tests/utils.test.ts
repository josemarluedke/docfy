import {
  generateUrl,
  isAnchorUrl,
  isValidUrl,
  inferTitle,
  parseFrontmatter
} from '../src/utils';
import { createRemark } from '../src/remark';

describe('#generateUrl', () => {
  test('base case', () => {
    expect(generateUrl('cool/markdown.md', {})).toBe('/markdown');
  });

  test('it uses category from metadata', () => {
    expect(generateUrl('cool/markdown.md', { category: 'components' })).toBe(
      '/components/markdown'
    );
  });

  test('it uses pacakge from metadata', () => {
    expect(generateUrl('cool/markdown.md', { package: 'awesome-lib' })).toBe(
      '/awesome-lib/markdown'
    );
  });

  test('it uses pacakge and category from metadata', () => {
    expect(
      generateUrl('cool/markdown.md', {
        package: 'awesome-lib',
        category: 'helpers'
      })
    ).toBe('/awesome-lib/helpers/markdown');
  });

  test('it passes package and category into slug', () => {
    expect(
      generateUrl('cool/markdown.md', {
        package: '@org/awesome-lib',
        category: 'helpers and modifiers'
      })
    ).toBe('/orgawesome-lib/helpers-and-modifiers/markdown');
  });

  test('it uses folder name if fine is called index', () => {
    expect(generateUrl('cool/button/index.md', {})).toBe('/button');
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
    const markdown = '---\ntitle: My Title\ncategory: test\n---\n\n# test\n';
    const remark = createRemark();
    const ast = remark.runSync(remark.parse(markdown));
    const result = parseFrontmatter('my-file.md', ast);

    expect(result).toEqual({
      title: 'My Title',
      category: 'test'
    });
  });
});
