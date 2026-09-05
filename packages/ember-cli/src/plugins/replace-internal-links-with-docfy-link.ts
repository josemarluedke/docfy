/// <reference types="mdast-util-to-hast" />
import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { PageContent } from '@docfy/core/lib/types.js';
import { html } from './utils';
import type { Root, RootContent } from 'mdast';

function visitor(page: PageContent<Root>): void {
  visit(page.ast, 'link', (node, index, parent) => {
    if (node.url[0] === '/') {
      const data = node.data || (node.data = {});
      const props = data.hProperties || (data.hProperties = {});

      const urlParts = node.url.split('#');
      const attributes = Object.keys(props)
        .map(key => {
          return `${key}=${String(props[key])}`;
        })
        .join(' ');

      const toInsert: RootContent[] = [
        html(
          `<DocfyLink @to="${urlParts[0]}" ${
            urlParts[1] ? `@anchor="${urlParts[1]}"` : ''
          } ${attributes}>`
        ),
        ...node.children,
        html(`</DocfyLink>`),
      ];

      if (parent && typeof index === 'number') {
        // `visit` types `parent` as the union of every mdast parent, whose
        // `children` arrays hold different node types, so `splice` is not
        // callable on the union. The raw `html` nodes also sit where mdast only
        // allows phrasing content; `mdast-util-to-hast` passes them through
        // untouched, which is what makes the surrounding tags work.
        const children = (parent as unknown as { children: RootContent[] }).children;

        children.splice(index, 1, ...toInsert);
      }
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
