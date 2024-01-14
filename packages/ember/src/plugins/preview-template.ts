import visit from 'unist-util-visit';
import plugin from '@docfy/core/lib/plugin';
import { DemoComponent, CodeNode } from './types';
import {
  generateDemoComponentName,
  getExt,
  createDemoNodes,
  isDemoComponents,
  replaceNode
} from './utils';
import path from 'path';

export default plugin({
  runWithMdast(ctx): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach((page) => {
      const demoComponents: DemoComponent[] = [];

      visit(page.ast, 'code', (node: CodeNode) => {
        if (['preview-template', 'preview'].includes(node.meta || '')) {
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
                type: node.meta as string
              }
            ]
          });
        }
      });

      demoComponents.forEach((demoComponent) => {
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
  }
});
