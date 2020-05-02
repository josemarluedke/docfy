import visit from 'unist-util-visit';
import { Context } from '@docfy/core/dist/types';
import { Node } from 'unist';
import toHtml from 'hast-util-to-html';

interface LinkNode extends Node {
  title: string | null;
  url: string;
  children: Node[];
}

/**
 * This function finds all the links starting with an `/` and replace them with
 * DocfyLink Component.
 */
export default function docfyLink(ctx: Context): void {
  ctx.pages.forEach((page) => {
    visit(page.ast, 'link', (node: LinkNode) => {
      if (node.url[0] === '/') {
        const data = node.data || (node.data = {});
        const props = (data.hProperties || (data.hProperties = {})) as Record<
          string,
          unknown
        >;

        const attributes = Object.keys(props)
          .map((key) => {
            return `${key}=${String(props[key])}`;
          })
          .join(' ');

        node.type = 'html';
        node.value = `<DocfyLink @to="${node.url}" ${attributes}>${toHtml(
          node.children
        )}</DocfyLink>`;
        node.children = [];
        node.data = undefined;
      }
    });
  });
}
