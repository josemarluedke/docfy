import plugin from '../plugin';
import stringify from 'rehype-stringify';

export default plugin({
  runAfter(context): void {
    const rehype = context.rehype().use(stringify, {
      allowDangerousHtml: true
    });

    context.pages.forEach((page) => {
      page.rendered = rehype.stringify(page.ast);
      page.demos?.forEach((demo) => {
        demo.rendered = rehype.stringify(demo.ast);
      });
    });
  }
});
