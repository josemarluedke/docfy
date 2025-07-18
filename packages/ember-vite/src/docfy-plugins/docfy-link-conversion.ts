import plugin from '@docfy/core/lib/plugin.js';
import visit from 'unist-util-visit';
import u from 'unist-builder';
import type { Context, PageContent } from '@docfy/core/lib/types';
import type { Node, Parent } from 'unist';
import type { PluginData, ImportStatement } from '../types.js';
import { getComponentImport } from '../import-map.js';

interface LinkNode extends Node {
  title: string | null;
  url: string;
  children: Node[];
}

function processPageForInternalLinks(page: PageContent): boolean {
  let hasInternalLinks = false;

  visit(
    page.ast,
    'link',
    (node: LinkNode, index: number, parent: Parent | undefined) => {
      // Only process internal links that start with '/'
      if (node.url && node.url[0] === '/') {
        hasInternalLinks = true;

        const data = node.data || (node.data = {});
        const props = (data.hProperties || (data.hProperties = {})) as Record<
          string,
          unknown
        >;

        const urlParts = node.url.split('#');
        const attributes = Object.keys(props)
          .map((key) => {
            return `${key}="${String(props[key])}"`;
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
          u('html', `</DocfyLink>`)
        ];

        if (parent && parent.children) {
          parent.children.splice(index, 1, ...toInsert);
        }
      }
    }
  );

  return hasInternalLinks;
}

/**
 * This plugin finds all the links starting with `/` and replaces them with
 * the `DocfyLink` component. It also adds the DocfyLink component to the
 * page imports metadata.
 *
 * For example:
 * [Getting Started](/docs/getting-started) -> <DocfyLink @to="/docs/getting-started">Getting Started</DocfyLink>
 * [API Reference](/docs/api#configuration) -> <DocfyLink @to="/docs/api" @anchor="configuration">API Reference</DocfyLink>
 */
export default plugin({
  runWithMdast(ctx: Context): void {
    ctx.pages.forEach((page) => {
      // Process page content and check for internal links in one pass
      const pageHasInternalLinks = processPageForInternalLinks(page);

      // Process demos and check for internal links in one pass
      let demoHasInternalLinks = false;
      if (Array.isArray(page.demos)) {
        page.demos.forEach((demo) => {
          const demoHasLinks = processPageForInternalLinks(demo);
          if (demoHasLinks) {
            demoHasInternalLinks = true;
          }
        });
      }

      // If page or demos have internal links, add DocfyLink to imports
      if (pageHasInternalLinks || demoHasInternalLinks) {
        const pluginData = page.pluginData as PluginData;
        if (!pluginData.imports) {
          pluginData.imports = [];
        }

        const existingImport = pluginData.imports.find(
          (imp) => imp.name === 'DocfyLink'
        );

        if (!existingImport) {
          pluginData.imports.push(getComponentImport('DocfyLink'));
        }
      }
    });
  }
});
