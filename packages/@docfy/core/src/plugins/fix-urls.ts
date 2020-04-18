import path from 'path';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { isValidUrl, isAnchorUrl } from '../utils';
import { Page, Context } from '../types';

interface LinkNode extends Node {
  title: string | null;
  url: string;
}

export function fixUrls(ctx: Context): void {
  ctx.pages.forEach((page: Page) => {
    visit(page.ast, 'link', (node: LinkNode) => {
      if (isValidUrl(node.url) || isAnchorUrl(node.url)) {
        return;
      }

      let absolutePath = node.url;
      if (!path.isAbsolute(node.url)) {
        absolutePath = path.resolve(
          path.join(ctx.root, path.dirname(page.source)),
          node.url as string
        );
      }
      const relativePath = absolutePath.replace(path.join(ctx.root, '/'), '');

      const found = ctx.pages.find((p) => {
        return p.source === relativePath;
      });

      if (found && found.metadata.url) {
        node.url = found.metadata.url;
      }
    });
  });
}
