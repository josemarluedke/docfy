import plugin from '../plugin.js';
import stringify from 'rehype-stringify';
import type { Root as HastRoot } from 'hast';

export default plugin({
  runAfter(context): void {
    const rehype = context.rehype().use(stringify, {
      allowDangerousHtml: true,
    });

    context.pages.forEach(page => {
      page.rendered = rehype.stringify(page.ast as HastRoot);
      page.demos?.forEach(demo => {
        demo.rendered = rehype.stringify(demo.ast as HastRoot);
      });
    });
  },
});
