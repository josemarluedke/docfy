import visit from 'unist-util-visit';
import { Context } from '@docfy/core/lib/types';
import { Node } from 'unist';

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

        const urlParts = node.url.split('#');
        const attributes = Object.keys(props)
          .map((key) => {
            return `${key}=${String(props[key])}`;
          })
          .join(' ');

        const toRender = { type: 'root', children: node.children } as Node;

        node.type = 'html';
        node.value = `<DocfyLink @to="${urlParts[0]}" ${
          urlParts[1] ? `@anchor="${urlParts[1]}"` : ''
        } ${attributes}>${ctx.remark
          .stringify(toRender)
          .replace(/\n/g, ' ')
          .trim()}</DocfyLink>`;
        node.children = [];
        node.data = undefined;
      }
    });
  });
}
