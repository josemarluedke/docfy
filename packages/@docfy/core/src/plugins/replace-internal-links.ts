import path from 'path';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { isValidUrl, isAnchorUrl } from '../-private/utils';
import { PageContent, Context } from '../types';

interface LinkNode extends Node {
  title: string | null;
  url: string;
}

/**
 * This plugin finds all internal links from the markdown and replace them with
 * the generated url for the file.
 *
 * For example, a markdown file could contain something like this:
 * ```md
 * [Link to another page](../some-other-markdown.md)
 * ```
 */
export function replaceInternalLinks(ctx: Context): void {
  ctx.pages.forEach((page: PageContent) => {
    visit(page.ast, 'link', (node: LinkNode) => {
      if (isValidUrl(node.url) || isAnchorUrl(node.url)) {
        return;
      }

      let absolutePath = node.url;
      if (!path.isAbsolute(node.url)) {
        absolutePath = path.resolve(
          path.join(page.sourceConfig.root, path.dirname(page.source)),
          node.url
        );
      }
      const found = ctx.pages.find((p) => {
        return path.join(p.sourceConfig.root, p.source) === absolutePath;
      });

      if (found && found.meta.url) {
        node.url = found.meta.url;
      }
    });
  });
}
