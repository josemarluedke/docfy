import { uniquefyUrls } from '../src/plugins/uniquefy-urls';
import { Context } from '../src/types';

describe('it changes the url if duplicatd', () => {
  test('when there is only one duplicated url', () => {
    const context = {
      pages: [
        {
          url: '/something/cool'
        },
        {
          url: '/something/cool'
        }
      ]
    };

    uniquefyUrls(context as Context);

    expect(context.pages.map((page) => page.url)).toEqual([
      '/something/cool',
      '/something/cool-1'
    ]);
  });

  test('when there are more then one duplicated url', () => {
    const context = {
      pages: [
        {
          url: '/something/cool'
        },
        {
          url: '/something/cool'
        },
        {
          url: '/something/cool'
        }
      ]
    };

    uniquefyUrls(context as Context);

    expect(context.pages.map((page) => page.url)).toEqual([
      '/something/cool',
      '/something/cool-1',
      '/something/cool-2'
    ]);
  });

  test('when there are duplicated index pages', () => {
    const context = {
      pages: [
        {
          url: '/something/blog/'
        },
        {
          url: '/something/blog/'
        }
      ]
    };

    uniquefyUrls(context as Context);

    expect(context.pages.map((page) => page.url)).toEqual([
      '/something/blog/',
      '/something/blog/index-1'
    ]);
  });
});
