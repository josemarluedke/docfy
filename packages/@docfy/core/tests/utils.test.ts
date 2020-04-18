import { generateUrl, isAnchorUrl, isValidUrl } from '../src/utils';

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
