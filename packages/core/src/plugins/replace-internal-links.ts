import path from 'path';
import plugin from '../plugin.js';
import { visit } from 'unist-util-visit';
import { isValidUrl, isAnchorUrl } from '../-private/utils.js';
import { PageContent, Context } from '../types.js';
import type { Root as MdastRoot, Definition, Link } from 'mdast';

function replaceURL(
  ctx: Context<MdastRoot>,
  page: PageContent<MdastRoot>,
  node: Link | Definition
): void {
  if (isValidUrl(node.url) || isAnchorUrl(node.url)) {
    return;
  }

  const urlParts = node.url.split('#');
  let absolutePath = node.url;
  if (!path.isAbsolute(node.url)) {
    absolutePath = path.resolve(
      path.join(page.sourceConfig.root, path.dirname(page.source)),
      urlParts[0]
    );
  }
  const found = ctx.pages.find(p => {
    return path.join(p.sourceConfig.root, p.source) === absolutePath;
  });

  if (found && found.meta.url) {
    node.url = found.meta.url;
    if (urlParts[1]) {
      node.url = `${node.url}#${urlParts[1]}`;
    }
  }
}

function visitor(ctx: Context<MdastRoot>, page: PageContent<MdastRoot>): void {
  const definitions: Record<string, Definition> = {};

  visit(page.ast, 'definition', node => {
    definitions[node.identifier] = node;
  });

  visit(page.ast, ['link', 'linkReference'], node => {
    if (node.type === 'linkReference') {
      if (definitions[node.identifier]) {
        replaceURL(ctx, page, definitions[node.identifier]);
      }
    } else if (node.type === 'link') {
      replaceURL(ctx, page, node);
    }
  });
}

/**
 * This plugin finds all internal links from the markdown and replace them with
 * the generated url for that file.
 *
 * For example, a markdown file could contain something like this:
 * ```md
 * [Link to another page](../some-other-markdown.md)
 * ```
 */
export default plugin({
  runWithMdast(ctx): void {
    ctx.pages.forEach(page => {
      visitor(ctx, page);

      if (Array.isArray(page.demos)) {
        page.demos.forEach(demo => {
          visitor(ctx, demo);
        });
      }
    });
  },
});
