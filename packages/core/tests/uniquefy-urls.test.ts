import { uniquefyUrls } from '../src/plugins/uniquefy-urls';
import { Context } from '../src/types';

describe('it changes the url if duplicatd', () => {
  test('when there is only one duplicated url', () => {
    const content = {
      pages: [
        {
          meta: {
            url: '/something/cool'
          }
        },
        {
          meta: {
            url: '/something/cool'
          }
        }
      ]
    };

    uniquefyUrls(content as Context);

    expect(content.pages.map((page) => page.meta.url)).toEqual([
      '/something/cool',
      '/something/cool-1'
    ]);
  });

  test('when there are more then one duplicated url', () => {
    const content = {
      pages: [
        {
          meta: {
            url: '/something/cool'
          }
        },
        {
          meta: {
            url: '/something/cool'
          }
        },
        {
          meta: {
            url: '/something/cool'
          }
        }
      ]
    };

    uniquefyUrls(content as Context);

    expect(content.pages.map((page) => page.meta.url)).toEqual([
      '/something/cool',
      '/something/cool-1',
      '/something/cool-2'
    ]);
  });

  test('when there are duplicated index pages', () => {
    const content = {
      pages: [
        {
          meta: {
            url: '/something/blog/'
          }
        },
        {
          meta: {
            url: '/something/blog/'
          }
        }
      ]
    };

    uniquefyUrls(content as Context);

    expect(content.pages.map((page) => page.meta.url)).toEqual([
      '/something/blog/',
      '/something/blog/index-1'
    ]);
  });
});
