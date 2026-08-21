import { visit } from 'unist-util-visit';
import plugin from '../plugin.js';
import { PageContent } from '../types.js';
import { isValidUrl } from '../-private/utils.js';
import path from 'path';
import type { Root as MdastRoot, Definition, Image } from 'mdast';

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

    function transform(page: PageContent<MdastRoot>, node: Definition | Image): void {
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
      const definitions: Record<string, Definition> = {};

      visit(page.ast, 'definition', node => {
        definitions[node.identifier] = node;
      });

      visit(page.ast, ['image', 'imageReference'], node => {
        if (node.type === 'imageReference') {
          if (definitions[node.identifier]) {
            transform(page, definitions[node.identifier]);
          }
        } else if (node.type === 'image') {
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
