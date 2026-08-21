import plugin from '@docfy/core/lib/plugin.js';
import type { Html, Root, RootContent } from 'mdast';

// This plugin was inpired by TailwindCSS's code:
// https://github.com/tailwindlabs/tailwindcss.com/blob/1234b4faded6c7a06b734c49c61257137b4acc9b/remark/withProse.js

function shouldUnproseNode(node: RootContent): boolean {
  return Boolean(
    node.type === 'code' &&
    node.meta &&
    ['component', 'template', 'preview-template', 'preview'].includes(node.meta)
  );
}

function withProse(tree: Root, className = 'prose', notClassName = 'not-prose'): void {
  const openProse = (): Html => ({
    type: 'html',
    value: `<div class="${className}">`,
  });
  const openNotProse = (): Html => ({
    type: 'html',
    value: `<div class="${notClassName}">`,
  });
  const close = (): Html => ({ type: 'html', value: '</div>' });

  tree.children = [
    openProse(),
    tree.children.flatMap(node => {
      if (shouldUnproseNode(node)) {
        return [openNotProse(), node, close()];
      }

      return [node];
    }),
    close(),
  ].flat();
}

interface WithProseOptions {
  /**
   * The class names to apply.
   * @default 'prose'
   */
  className?: string;
}

const DocfyPluginWithProse = plugin.withOptions<WithProseOptions | undefined>({
  runWithMdast(ctx, options) {
    ctx.pages.forEach(page => {
      withProse(page.ast, options?.className);

      page.demos?.forEach(demo => {
        withProse(demo.ast, options?.className);
      });
    });
  },
});

export default DocfyPluginWithProse;
