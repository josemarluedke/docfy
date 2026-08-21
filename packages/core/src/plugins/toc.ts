import plugin from '../plugin.js';
import { Heading } from '../types.js';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { deleteNode } from '../-private/utils.js';
import type { Heading as HeadingNode } from 'mdast';

function getHeading(node: HeadingNode): Heading {
  return {
    title: toString(node),
    // `mdastSlug` runs on every tree before any plugin does, so `data.id` is
    // always set by the time we get here. It is optional in the type because
    // it is a Docfy augmentation of mdast's `HeadingData`.
    id: node.data?.id as string,
    depth: node.depth,
  };
}

function findParentOfDepth(headings: Heading[], depth: number): Heading[] {
  if (headings.length > 0) {
    const lastItem = headings[headings.length - 1];

    if (lastItem.depth === depth) {
      return headings;
    } else {
      if (typeof lastItem.headings === 'undefined') {
        lastItem.headings = [];
      }
      return findParentOfDepth(lastItem.headings, depth);
    }
  } else {
    return headings;
  }
}

export default plugin({
  runWithMdast(ctx): void {
    ctx.pages.forEach((page): void => {
      const headings: Heading[] = [];

      visit(page.ast, 'heading', (node, _, parentNode) => {
        if (node.depth === 1) {
          return;
        }

        if (node.depth > ctx.options.tocMaxDepth) {
          return;
        }
        const parent = findParentOfDepth(headings, node.depth);

        parent.push(getHeading(node));

        if (node.data?.docfyDelete && parentNode) {
          deleteNode(parentNode.children, node);
        }
      });

      page.meta.headings = headings;
    });
  },
});
