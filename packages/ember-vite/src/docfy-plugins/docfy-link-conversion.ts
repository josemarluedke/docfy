import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { html } from './utils.js';
import type { PageContent } from '@docfy/core/lib/types.js';
import type { Root, RootContent } from 'mdast';
import type { PluginData } from '../types.js';
import { getComponentImport } from '../import-map.js';

function processPageForInternalLinks(page: PageContent<Root>): boolean {
  let hasInternalLinks = false;

  visit(page.ast, 'link', (node, index, parent) => {
    // Only process internal links that start with '/'
    if (node.url && node.url[0] === '/') {
      hasInternalLinks = true;

      const data = node.data || (node.data = {});
      const props = data.hProperties || (data.hProperties = {});

      const urlParts = node.url.split('#');
      const attributes = Object.keys(props)
        .map(key => {
          return `${key}="${String(props[key])}"`;
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
  runWithMdast(ctx): void {
    ctx.pages.forEach(page => {
      // Process page content and check for internal links in one pass
      const pageHasInternalLinks = processPageForInternalLinks(page);

      // Process demos and check for internal links in one pass
      let demoHasInternalLinks = false;
      if (Array.isArray(page.demos)) {
        page.demos.forEach(demo => {
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

        const existingImport = pluginData.imports.find(imp => imp.name === 'DocfyLink');

        if (!existingImport) {
          pluginData.imports.push(getComponentImport('DocfyLink'));
        }
      }
    });
  },
});
