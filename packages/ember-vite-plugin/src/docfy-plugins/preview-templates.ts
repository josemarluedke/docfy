import visit from 'unist-util-visit';
import plugin from '@docfy/core/lib/plugin.js';
import { Context, PageContent } from '@docfy/core/lib/types';
import { PreviewTemplateComponent } from '../types.js';

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
 * Docfy core plugin to extract preview template components from markdown
 * This plugin finds code blocks with 'preview-template' meta and converts them
 * to component metadata stored in pluginData
 */
export default plugin({
  runWithMdast(ctx: Context): void {
    ctx.pages.forEach((page: PageContent) => {
      const previewComponents: PreviewTemplateComponent[] = [];
      let componentIndex = 1;

      // Visit all code blocks in the page AST
      visit(page.ast, 'code', (node: any) => {
        if (node.meta === 'preview-template' || node.meta === 'preview') {
          const componentName = `PreviewTemplate${componentIndex++}`;

          // Un-escape handlebars (same as demo components)
          const templateContent = node.value.replace(/\\{{/g, '{{');

          // Get file extension from language or default to hbs
          const ext = getExt(node.lang || 'hbs');

          previewComponents.push({
            name: componentName,
            template: templateContent,
            ext: ext,
            originalNode: node // Keep reference to replace in AST later
          });
        }
      });

      // Store preview components in pluginData
      if (previewComponents.length > 0) {
        if (!page.pluginData) {
          page.pluginData = {};
        }
        page.pluginData.previewComponents = previewComponents;
      }
    });
  }
});
