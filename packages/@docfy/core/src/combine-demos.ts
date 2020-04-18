import path from 'path';
import { Content, Context } from './types';

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
function findDemoOwner(contents: Content[], demoSource: string): number {
  const folder = path.basename(path.dirname(demoSource));

  let parentName = folder.replace('-demo', '');
  if (parentName === 'demo') {
    parentName = path.basename(path.dirname(path.dirname(demoSource)));
  }

  return contents.findIndex((item: Content): boolean => {
    const file = path.parse(path.basename(item.source));
    return (
      file.name === parentName ||
      (file.name === 'index' &&
        path.basename(path.dirname(item.source)) === parentName)
    );
  });
}

export default function CombineDemos(context: Context): Context {
  context.contents.forEach((item: Content, index: number): void => {
    const folder = path.basename(path.dirname(item.source));

    if (folder.match(/demo$/)) {
      const parent =
        context.contents[findDemoOwner(context.contents, item.source)];

      if (parent) {
        if (!parent.demos) {
          parent.demos = [item];
        } else {
          parent.demos.push(item);
        }

        context.contents.splice(index, 1);
      }
    }
  });

  return context;
}
