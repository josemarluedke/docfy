import path from 'path';
import plugin from '../plugin';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { isValidUrl, isAnchorUrl } from '../-private/utils';
import { PageContent, Context } from '../types';

interface Resource {
  url: string;
  title?: string;
}
interface Association {
  identifier: string;
  label?: string;
}

interface LinkNode extends Node, Resource {
  type: 'link';
}

interface LinkReferenceNode extends Node, Association {
  type: 'linkReference';
}

interface DefinitionNode extends Node, Resource, Association {
  type: 'definition';
}

function replaceURL(ctx: Context, page: PageContent, node: LinkNode | DefinitionNode): void {
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

function isReferenceLink(node: LinkNode | LinkReferenceNode): node is LinkReferenceNode {
  return node.type === 'linkReference';
}

function visitor(ctx: Context, page: PageContent): void {
  const definitions: Record<string, DefinitionNode> = {};

  visit(page.ast, 'definition', (node: DefinitionNode) => {
    definitions[node.identifier] = node;
  });

  visit(page.ast, ['link', 'linkReference'], (node: LinkNode | LinkReferenceNode) => {
    if (isReferenceLink(node)) {
      if (definitions[node.identifier]) {
        replaceURL(ctx, page, definitions[node.identifier]);
      }
    } else {
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
