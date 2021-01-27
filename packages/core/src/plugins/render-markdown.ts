import { Context } from '../types';
import stringify from 'rehype-stringify';

export const renderMarkdown = {
  transformHast(context: Context): void {
    context.pages.forEach((page) => {
      const rehype = context.rehype().use(stringify);
      page.rendered = rehype.stringify(page.ast);
    });
  }
};
