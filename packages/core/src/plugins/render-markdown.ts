import plugin from '../plugin';
import stringify from 'rehype-stringify';

export default plugin({
  runAfter(context): void {
    context.pages.forEach((page) => {
      const rehype = context.rehype().use(stringify, {
        allowDangerousHtml: true
      });
      page.rendered = rehype.stringify(page.ast);
    });
  }
});
