import { Context, Heading } from '../types';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import toString from 'mdast-util-to-string';

interface HeadingNode extends Node {
  depth: number;
  data: {
    id: string;
  };
}

function getHeading(node: HeadingNode): Heading {
  return {
    title: toString(node),
    id: node.data.id,
    depth: node.depth
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

export function toc(ctx: Context): Context {
  ctx.pages.forEach((page): void => {
    const headings: Heading[] = [];

    visit(page.ast, 'heading', (node: HeadingNode) => {
      if (node.depth === 1) {
        return;
      }

      if (node.depth > ctx.options.tocMaxDepth) {
        return;
      }
      const parent = findParentOfDepth(headings, node.depth);
      parent.push(getHeading(node));
    });

    page.headings = headings;
  });

  return ctx;
}
