import { Context } from '../types';
import stringify from 'rehype-stringify';

export const renderMarkdown = {
  default(context: Context): void {
    context.pages.forEach((page) => {
      const rehype = context.rehype().use(stringify, {
        allowDangerousHtml: true
      });
      page.rendered = rehype.stringify(page.ast);
    });
  }
};
