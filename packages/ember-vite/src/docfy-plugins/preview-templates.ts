import { visit } from 'unist-util-visit';
import plugin from '@docfy/core/lib/plugin.js';
import {
  generateDemoComponentName,
  getExt,
  createDemoNodes,
  isDemoComponents,
  replaceNode,
} from './utils.js';
import { findFenceMarker } from './fence-meta.js';
import path from 'path';

import type { DemoComponent } from '../types.js';

const PREVIEW_MARKERS = ['preview-template', 'preview'] as const;

export default plugin({
  runWithMdast(ctx): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach(page => {
      const demoComponents: DemoComponent[] = [];

      visit(page.ast, 'code', node => {
        // The marker shares the meta string with the code block options
        // (`collapsible`, `title=`, ...), so it is matched per token rather
        // than against the whole string.
        const marker = findFenceMarker(node.meta, PREVIEW_MARKERS);

        if (marker) {
          demoComponents.push({
            name: generateDemoComponentName(
              `docfy-demo-preview-${path.basename(page.meta.url)}`,
              seenNames
            ),
            chunks: [
              {
                snippet: node,
                code: node.value.replace(/\\{{/g, '{{'), // un-escape hbs
                ext: getExt(node.lang || 'hbs'),
                type: marker,
              },
            ],
          });
        }
      });

      demoComponents.forEach(demoComponent => {
        replaceNode(
          page.ast.children,
          demoComponent.chunks[0].snippet,
          ...createDemoNodes(demoComponent)
        );
      });

      if (isDemoComponents(page.pluginData.demoComponents)) {
        page.pluginData.demoComponents.push(...demoComponents);
      } else {
        page.pluginData.demoComponents = demoComponents;
      }
    });
  },
});
