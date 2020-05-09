import path from 'path';
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

function replaceURL(
  ctx: Context,
  page: PageContent,
  node: LinkNode | DefinitionNode
): void {
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
}

function isReferenceLink(
  node: LinkNode | LinkReferenceNode
): node is LinkReferenceNode {
  return node.type === 'linkReference';
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
    const definitions: Record<string, DefinitionNode> = {};

    visit(page.ast, 'definition', (node: DefinitionNode) => {
      definitions[node.identifier] = node;
    });

    visit(
      page.ast,
      ['link', 'linkReference'],
      (node: LinkNode | LinkReferenceNode) => {
        if (isReferenceLink(node)) {
          if (definitions[node.identifier]) {
            replaceURL(ctx, page, definitions[node.identifier]);
          }
        } else {
          replaceURL(ctx, page, node);
        }
      }
    );
  });
}
