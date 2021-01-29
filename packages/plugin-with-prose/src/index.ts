import plugin from '@docfy/core/lib/plugin';
import type { Node, Parent } from 'unist';

interface NodeWithMeta extends Node {
  meta?: string;
}

// This plugin was inpired by TailwindCSS's code:
// https://github.com/tailwindlabs/tailwindcss.com/blob/1234b4faded6c7a06b734c49c61257137b4acc9b/remark/withProse.js

function shouldUnproseNode(node: NodeWithMeta): boolean {
  return (
    ['html'].includes(node.type) ||
    Boolean(
      node.type === 'code' &&
        node.meta &&
        ['component', 'template', 'preview-template'].includes(node.meta)
    )
  );
}

function withProse(tree: Parent, className = 'prose'): void {
  let insideProse = false;
  tree.children = tree.children.flatMap((node, i) => {
    if (insideProse && shouldUnproseNode(node)) {
      insideProse = false;
      return [{ type: 'html', value: '</div>' }, node];
    }
    if (!insideProse && !shouldUnproseNode(node)) {
      insideProse = true;
      return [
        { type: 'html', value: `<div class="${className}">` },
        node,
        ...(i === tree.children.length - 1
          ? [{ type: 'html', value: '</div>' }]
          : [])
      ];
    }
    if (i === tree.children.length - 1 && insideProse) {
      return [node, { type: 'html', value: '</div>' }];
    }
    return [node];
  });
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
    ctx.pages.forEach((page) => {
      withProse(page.ast as Parent, options?.className);

      page.demos?.forEach((demo) => {
        withProse(demo.ast as Parent, options?.className);
      });
    });
  }
});

export default DocfyPluginWithProse;
module.exports = DocfyPluginWithProse;
