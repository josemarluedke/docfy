import { Context } from '../types';

/**
 * This plugin removes unnecessary index pages.
 * These can happen when there are folders with an
 * index.md/readme.md and no subfolder/pages nested.
 */
export default {
  runAfter(ctx: Context): void {
    const urls: string[] = [];
    ctx.pages.forEach((page) => {
      urls.push(page.meta.url);
    });

    ctx.pages.forEach((page) => {
      if (/\/$/.test(page.meta.url)) {
        const matched = urls.filter((url) => {
          const r = new RegExp(page.meta.url);

          return r.test(url);
        });
        if (matched.length == 1) {
          page.meta.url = page.meta.url.replace(
            /\/$/,
            page.sourceConfig.urlSuffix || ''
          );
        }
      }
    });
  }
};
