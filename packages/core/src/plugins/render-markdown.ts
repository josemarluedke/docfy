import { Context } from '../types';
import stringify from 'rehype-stringify';

export default {
  runAfter(context: Context): void {
    context.pages.forEach((page) => {
      const rehype = context.rehype().use(stringify, {
        allowDangerousHtml: true
      });
      page.rendered = rehype.stringify(page.ast);
    });
  }
};
