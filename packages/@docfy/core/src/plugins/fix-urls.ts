import path from 'path';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { isValidUrl, isAnchorUrl } from '../utils';
import { PageContent, Context } from '../types';

interface LinkNode extends Node {
  title: string | null;
  url: string;
}

export function fixUrls(ctx: Context): void {
  ctx.pages.forEach((page: PageContent) => {
    visit(page.ast, 'link', (node: LinkNode) => {
      if (isValidUrl(node.url) || isAnchorUrl(node.url)) {
        return;
      }

      let absolutePath = node.url;
      if (!path.isAbsolute(node.url)) {
        absolutePath = path.resolve(
          path.join(path.sep, path.dirname(page.source)),
          node.url
        );
      }
      const relativePath = absolutePath.substr(1);

      const found = ctx.pages.find((p) => {
        return p.source === relativePath;
      });

      if (found && found.url) {
        node.url = found.url;
      }
    });
  });
}
