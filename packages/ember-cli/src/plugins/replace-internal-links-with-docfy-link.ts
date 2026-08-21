import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { PageContent } from '@docfy/core/lib/types.js';
import { Node, Parent } from 'unist';
import { u } from 'unist-builder';

interface LinkNode extends Node {
  title: string | null;
  url: string;
  children: Node[];
}

function visitor(page: PageContent): void {
  visit(page.ast, 'link', (visited, index, visitedParent) => {
    const node = visited as unknown as LinkNode;
    const parent = visitedParent as unknown as Parent | undefined;

    if (node.url[0] === '/') {
      const data = node.data || (node.data = {});
      const props = (data.hProperties || (data.hProperties = {})) as Record<string, unknown>;

      const urlParts = node.url.split('#');
      const attributes = Object.keys(props)
        .map(key => {
          return `${key}=${String(props[key])}`;
        })
        .join(' ');

      const toInsert: Node[] = [
        u(
          'html',
          `<DocfyLink @to="${urlParts[0]}" ${
            urlParts[1] ? `@anchor="${urlParts[1]}"` : ''
          } ${attributes}>`
        ),
        ...node.children,
        u('html', `</DocfyLink>`),
      ];

      parent?.children.splice(index, 1, ...toInsert);
    }
  });
}

/**
 * This function finds all the links starting with an `/` and replace them with
 * the `DocfyLink` component.
 */
export default plugin({
  runWithMdast(ctx): void {
    ctx.pages.forEach(page => {
      visitor(page);

      if (Array.isArray(page.demos)) {
        page.demos.forEach(demo => {
          visitor(demo);
        });
      }
    });
  },
});
