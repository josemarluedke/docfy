import plugin from '@docfy/core/lib/plugin.js';
import { Context, PageContent } from '@docfy/core/lib/types';
import { DemoComponent, DemoComponentChunk } from '../types.js';

// Map language names to file extensions (same as original ember implementation)
const MAP_LANG_TO_EXT = {
  javascript: 'js',
  typescript: 'ts',
  handlebars: 'hbs',
  'html.hbs': 'hbs',
  'html.handlebars': 'hbs'
};

function getExt(lang: string): string {
  lang = lang.toLowerCase();
  return MAP_LANG_TO_EXT[lang] || lang;
}

/**
 * Docfy core plugin to extract demo components from page metadata
 * This plugin processes existing demo data and stores it in a standardized format
 * for consumption by the GJS template generator
 */
export default plugin({
  runWithMdast(ctx: Context): void {
    ctx.pages.forEach((page: PageContent) => {
      if (page.demos) {
        const demoComponents: DemoComponent[] = [];

        page.demos.forEach((demo) => {
          // Generate component name based on demo source (matching original ember implementation)
          const baseName = demo.source.split('/').pop()?.replace('.md', '') || 'demo';
          const componentName = `Demo${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;

          // Extract code chunks from demo ast - matching original ember implementation
          const chunks: DemoComponentChunk[] = [];

          if (demo.ast && Array.isArray(demo.ast.children)) {
            demo.ast.children.forEach((node: any) => {
              if (node.type === 'code') {
                // Only process code blocks with specific meta attributes
                if (['component', 'template', 'styles'].includes(node.meta || '')) {
                  chunks.push({
                    code: node.value.replace(/\\{{/g, '{{'), // un-escape hbs (matching original)
                    ext: getExt(node.lang || (node.meta === 'template' ? 'hbs' : 'js')), // matching original fallback logic
                    type: node.meta as string,
                    snippet: node // Keep reference to original node for potential snippet rendering
                  });
                }
              }
            });
          }

          if (chunks.length > 0) {
            demoComponents.push({
              name: componentName,
              chunks
            });
          }
        });

        // Store demo components in pluginData for the GJS generator to consume
        if (!page.pluginData) {
          page.pluginData = {};
        }
        page.pluginData.demoComponents = demoComponents;
      }
    });
  }
});