import visit from 'unist-util-visit';
import plugin from '@docfy/core/lib/plugin.js';
import { Context, PageContent } from '@docfy/core/lib/types';
import { replaceNode, createDemoNodes } from './utils.js';

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
 * to demo components stored in pluginData.demoComponents (same as original ember implementation)
 */
export default plugin({
  runWithMdast(ctx: Context): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach((page: PageContent) => {
      const demoComponents: any[] = [];

      // Visit all code blocks in the page AST
      visit(page.ast, 'code', (node: any) => {
        if (node.meta === 'preview-template' || node.meta === 'preview') {
          // Generate component name similar to original ember implementation
          const baseName = `docfy-demo-preview-${page.meta.url
            .replace(/\//g, '-')
            .replace(/^-/, '')}`;
          const { dashCase, pascalCase } = generateDemoComponentName(
            baseName,
            seenNames
          );

          // Un-escape handlebars (same as demo components)
          const templateContent = node.value.replace(/\\{{/g, '{{');

          // Get file extension from language or default to hbs
          const ext = getExt(node.lang || 'hbs');

          const component = {
            name: { dashCase, pascalCase },
            chunks: [
              {
                snippet: node, // Original AST node (same as ember implementation)
                code: templateContent,
                ext: ext,
                type: node.meta as string
              }
            ]
          };

          demoComponents.push({
            name: pascalCase, // Use pascalCase name for component generation (for file generation)
            chunks: component.chunks
          });
        }
      });

      // Store components for AST replacement
      const componentsForReplacement: any[] = [];

      // Process each demo component for AST replacement
      demoComponents.forEach((demo) => {
        const component = {
          name: {
            dashCase: generateDemoComponentName(
              `docfy-demo-preview-${page.meta.url
                .replace(/\//g, '-')
                .replace(/^-/, '')}`,
              seenNames
            ).dashCase,
            pascalCase: demo.name
          },
          chunks: demo.chunks
        };

        componentsForReplacement.push(component);
      });

      // Replace AST nodes with DocfyDemo nodes (same as original ember implementation)
      componentsForReplacement.forEach((component) => {
        replaceNode(
          page.ast.children,
          component.chunks[0].snippet,
          ...createDemoNodes(component)
        );
      });

      // Add preview template components to pluginData.demoComponents for component generation
      // (They're filtered out from Examples section in GJS processor)
      if (demoComponents.length > 0) {
        if (!page.pluginData) {
          page.pluginData = {};
        }
        if (!Array.isArray(page.pluginData.demoComponents)) {
          page.pluginData.demoComponents = [];
        }
        (page.pluginData.demoComponents as any[]).push(...demoComponents);
      }
    });
  }
});

// Helper function to generate component names (similar to original ember implementation)
function generateDemoComponentName(
  identifier: string,
  seenNames: Set<string>,
  tentativeCount = 1
): { dashCase: string; pascalCase: string } {
  const dashCase =
    tentativeCount === 1
      ? identifier.toLowerCase().replace(/[^a-z0-9]/g, '-')
      : `${identifier
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')}-${tentativeCount}`;

  if (seenNames.has(dashCase)) {
    return generateDemoComponentName(identifier, seenNames, tentativeCount + 1);
  }

  seenNames.add(dashCase);

  const pascalCase = dashCase
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return { dashCase, pascalCase };
}
