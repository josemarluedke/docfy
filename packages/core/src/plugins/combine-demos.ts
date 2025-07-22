import path from 'path';
import plugin from '../plugin';
import { PageContent, Context } from '../types';

/*
 * Finds the index of the owner for a given demo file.
 *
 * Demos should be located in a folder named `demo/` or `something-demo/`.
 *
 * eg.
 * Below the owner would be the button/index.md:
 * components/button/
 *   - index.md
 *   - demo/
 *     - demo1.md
 *     - demo2.md
 *
 * Below the owner would be the button.md:
 * components/
 *   - button.md
 *   - button-demo/
 *     - demo1.md
 *     - demo2.md
 */
function findDemoOwner(contents: PageContent[], demoSource: string): number {
  const folder = path.basename(path.dirname(demoSource));

  let parentName = folder.replace(/-demo$/, '');
  if (parentName === 'demo') {
    parentName = path.basename(path.dirname(path.dirname(demoSource)));
  }

  return contents.findIndex((item): boolean => {
    const file = path.parse(path.basename(item.source));
    return (
      file.name === parentName ||
      (file.name === 'index' && path.basename(path.dirname(item.source)) === parentName)
    );
  });
}

function sortByOrder(pages: PageContent[]): PageContent[] {
  return pages.sort((a, b) => {
    const aOrder =
      typeof a.meta.frontmatter.order !== 'undefined' ? Number(a.meta.frontmatter.order) : 998;
    const bOrder =
      typeof b.meta.frontmatter.order !== 'undefined' ? Number(b.meta.frontmatter.order) : 999;
    return aOrder - bOrder;
  });
}

export default plugin({
  runBefore(context: Context): void {
    const allDemos: PageContent[] = [];

    context.pages.forEach((item): void => {
      const folder = path.basename(path.dirname(item.source));

      if (folder.match(/demo$/)) {
        const parent = context.pages[findDemoOwner(context.pages, item.source)];

        if (parent) {
          if (!parent.demos) {
            parent.demos = [item];
          } else {
            parent.demos.push(item);
          }

          sortByOrder(parent.demos);
          allDemos.push(item);
        }
      }
    });

    // Delete demos from context pages
    allDemos.forEach(demo => {
      const index = context.pages.findIndex(i => i === demo);
      if (index !== -1) {
        context.pages.splice(index, 1);
      }
    });
  },
});
