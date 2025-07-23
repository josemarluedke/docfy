import plugin from '@docfy/core/lib/plugin';
import { PageContent } from '@docfy/core/lib/types';
import type { Node, Parent } from 'unist';

interface NodeWithMeta extends Node {
  meta?: string;
}

// This plugin was inpired by TailwindCSS's code:
// https://github.com/tailwindlabs/tailwindcss.com/blob/1234b4faded6c7a06b734c49c61257137b4acc9b/remark/withProse.js

function shouldUnproseNode(node: NodeWithMeta): boolean {
  return Boolean(
    node.type === 'code' &&
      node.meta &&
      ['component', 'template', 'preview-template', 'preview'].includes(node.meta)
  );
}

function withProse(tree: Parent, className = 'prose', notClassName = 'not-prose'): void {
  const openProse = () => ({
    type: 'html',
    value: `<div class="${className}">`,
  });
  const openNotProse = () => ({
    type: 'html',
    value: `<div class="${notClassName}">`,
  });
  const close = () => ({ type: 'html', value: '</div>' });

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

interface Page {
  ast: Parent;
  demos?: Page[];
}

const DocfyPluginWithProse = plugin.withOptions<WithProseOptions | undefined>({
  runWithMdast(ctx, options) {
    ctx.pages.forEach((pageContent: PageContent) => {
      // PageContent may not have children, which is required for withProse
      // TODO: pageContent may need to be a union type
      const page = pageContent as unknown as Page;
      withProse(page.ast, options?.className);

      page.demos?.forEach(demo => {
        withProse(demo.ast, options?.className);
      });
    });
  },
});

export default DocfyPluginWithProse;
module.exports = DocfyPluginWithProse;
