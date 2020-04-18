import { isAnchorUrl, isValidUrl } from '../src/utils';

test('#isAnchorUrl', () => {
  expect(isAnchorUrl('#test')).toBe(true);
  expect(isAnchorUrl('../test')).toBe(false);
  expect(isAnchorUrl('https://google.com')).toBe(false);
});

test('isValidUrl', () => {
  expect(isValidUrl('#test')).toBe(false);
  expect(isValidUrl('../test')).toBe(false);
  expect(isValidUrl('https://google.com')).toBe(true);
});
