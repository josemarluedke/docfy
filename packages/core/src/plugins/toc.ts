import plugin from '../plugin';
import { Heading } from '../types';
import visit from 'unist-util-visit';
import { Node, Parent } from 'unist';
import toString from 'mdast-util-to-string';
import { deleteNode } from '../-private/utils';

interface HeadingNode extends Node {
  depth: number;
  data: {
    id: string;
    docfyDelete?: boolean;
  };
}

function getHeading(node: HeadingNode): Heading {
  return {
    title: toString(node),
    id: node.data.id,
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

function isHeading(node: Node): node is HeadingNode {
  return node.type === 'heading';
}

export default plugin({
  runWithMdast(ctx): void {
    ctx.pages.forEach((page): void => {
      const headings: Heading[] = [];

      visit(page.ast, (node: Node, _, parentNode: Parent | undefined) => {
        if (isHeading(node)) {
          if (node.depth === 1) {
            return;
          }

          if (node.depth > ctx.options.tocMaxDepth) {
            return;
          }
          const parent = findParentOfDepth(headings, node.depth);

          parent.push(getHeading(node));

          if (node.data.docfyDelete && parentNode) {
            deleteNode(parentNode.children, node);
          }
        }
      });

      page.meta.headings = headings;
    });
  },
});
