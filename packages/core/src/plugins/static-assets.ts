import visit from 'unist-util-visit';
import plugin from '../plugin';
import { PageContent } from '../types';
import { isValidUrl } from '../-private/utils';
import { Node } from 'unist';
import path from 'path';

interface Resource {
  url: string;
  title?: string;
}
interface Association {
  identifier: string;
  label?: string;
}

interface ImageReferenceNode extends Node, Association {
  type: 'imageReference';
}

interface DefinitionNode extends Node, Resource, Association {
  type: 'definition';
}

interface ImageNode extends Node, Resource {
  type: 'image';
}

function isImageReference(node: ImageNode | ImageReferenceNode): node is ImageReferenceNode {
  return node.type === 'imageReference';
}

function generateUniqueFileName(seen: string[], name: string, count?: number): string {
  if (seen.indexOf(name) == -1) {
    return name;
  }

  let candidate = name;
  if (!count) {
    count = 1;
  }

  const parts = path.parse(name);

  candidate = `${parts.name}-${count}${parts.ext}`;

  if (seen.indexOf(candidate) > -1) {
    return generateUniqueFileName(seen, name, count + 1);
  }
  return candidate;
}

export default plugin({
  runWithMdast(ctx): void {
    const staticAssetPath = (ctx.options.staticAssetsPath || '/assets/docfy').split('/');

    const assets: Record<string, string> = {};

    function transform(page: PageContent, node: DefinitionNode | ImageNode): void {
      if (!isValidUrl(node.url) && !path.isAbsolute(node.url)) {
        const absolutePath = path.resolve(
          path.join(page.sourceConfig.root, path.dirname(page.source)),
          node.url
        );

        if (assets[absolutePath]) {
          node.url = assets[absolutePath].split(path.sep).join('/');
        } else {
          const to = path.join(
            path.sep,
            ...staticAssetPath,
            generateUniqueFileName(Object.values(assets), path.basename(node.url))
          );

          node.url = to.split(path.sep).join('/');
          assets[absolutePath] = to;
        }
      }
    }

    ctx.pages.forEach(page => {
      const definitions: Record<string, DefinitionNode> = {};

      visit(page.ast, 'definition', (node: DefinitionNode) => {
        definitions[node.identifier] = node;
      });

      visit(page.ast, ['image', 'imageReference'], (node: ImageNode | ImageReferenceNode) => {
        if (isImageReference(node)) {
          if (definitions[node.identifier]) {
            transform(page, definitions[node.identifier]);
          }
        } else {
          transform(page, node);
        }
      });
    });

    Object.keys(assets).forEach(key => {
      ctx.staticAssets.push({
        fromPath: key,
        toPath: assets[key],
      });
    });
  },
});
