import plugin from '@docfy/core/lib/plugin.js';
import { Context, PageContent } from '@docfy/core/lib/types';
import { DemoComponent, DemoComponentChunk } from '../types.js';
import visit from 'unist-util-visit';
import findNode from 'unist-util-find';
import toString from 'mdast-util-to-string';
import path from 'path';
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
 * Generate component name like the original ember implementation
 */
function generateDemoComponentName(
  identifier: string,
  seenNames: Set<string>,
  tentativeCount = 1
): { dashCase: string; pascalCase: string } {
  const dashCase = identifier
    .split('.')[0]
    .toLowerCase()
    .replace(/\/|\\/g, '-')
    .replace(/[^a-zA-Z0-9|-]/g, '');

  const pascalCase = dashCase
    .replace(/(\w)(\w*)/g, function (_, g1, g2) {
      return `${g1.toUpperCase()}${g2.toLowerCase()}`;
    })
    .replace(/-(\d+)/g, function (_, g1) {
      return `_${g1}`;
    })
    .replace(/-/g, '');

  if (seenNames.has(dashCase)) {
    return generateDemoComponentName(
      `${dashCase}${tentativeCount}`,
      seenNames,
      tentativeCount + 1
    );
  }

  seenNames.add(dashCase);
  return {
    dashCase,
    pascalCase
  };
}

/**
 * Delete a node from AST children array
 */
function deleteNode(nodes: any[], nodeToDelete: any): void {
  if (!nodeToDelete || !Array.isArray(nodes)) {
    return;
  }

  const index = nodes.findIndex((item) => item === nodeToDelete);
  if (index !== -1) {
    nodes.splice(index, 1);
  }
}

// Manual demo insertion regexes (matching original ember implementation)
const demoMarkerRegex = /^\[\[demo:(.+?)\]\]$/;
const demosAllMarkerRegex = /^\[\[demos-all\]\]$/;

/**
 * Check if a node is a demo marker
 */
function demoMarker(node: any): string | null {
  if (node?.type === 'paragraph' && node?.children?.length === 1) {
    const textNode = node.children[0];
    if (textNode?.type === 'text') {
      const match = textNode.value.match(demoMarkerRegex);
      return match ? match[1] : null;
    }
  }
  return null;
}

/**
 * Check if a node is a demos-all marker
 */
function demosAllMarker(node: any): boolean {
  if (node?.type === 'paragraph' && node?.children?.length === 1) {
    const textNode = node.children[0];
    if (textNode?.type === 'text') {
      return demosAllMarkerRegex.test(textNode.value);
    }
  }
  return false;
}

/**
 * Replace demo markers with actual demo nodes
 */
function replaceDemoMarkers(
  page: PageContent,
  demoComponents: DemoComponent[]
): void {
  if (!page.meta?.frontmatter?.manualDemoInsertion) {
    return;
  }

  const nodesToReplace: { node: any; replacements: any[] }[] = [];

  // Find all marker nodes
  visit(page.ast, 'paragraph', (node: any) => {
    const markerName = demoMarker(node);
    if (markerName) {
      // Find matching demo component
      const matchingDemo = demoComponents.find((d) =>
        d.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .endsWith(markerName.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );

      if (matchingDemo) {
        // Convert paragraph to div and replace with demo nodes
        node.type = 'div';
        // Create component structure that createDemoNodes expects
        const componentForNodes = {
          name: {
            dashCase: matchingDemo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            pascalCase: matchingDemo.name
          },
          chunks: matchingDemo.chunks
        };
        nodesToReplace.push({
          node,
          replacements: createDemoNodes(componentForNodes)
        });
      } else {
        console.warn(
          `Demo component "${markerName}" not found for marker in ${page.meta.url}`
        );
      }
    } else if (demosAllMarker(node)) {
      // Replace with all demo components
      node.type = 'div';
      const allDemoNodes: any[] = [];
      demoComponents.forEach((demo) => {
        // Create component structure that createDemoNodes expects
        const componentForNodes = {
          name: {
            dashCase: demo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            pascalCase: demo.name
          },
          chunks: demo.chunks
        };
        allDemoNodes.push(...createDemoNodes(componentForNodes));
      });
      nodesToReplace.push({
        node,
        replacements: allDemoNodes
      });
    }
  });

  // Apply replacements
  nodesToReplace.forEach(({ node, replacements }) => {
    replaceNode(page.ast.children, node, ...replacements);
  });
}

/**
 * Docfy core plugin to extract demo components from page metadata
 * This plugin processes existing demo data and stores it in a standardized format
 * for consumption by the GJS template generator (matching original ember implementation)
 */
export default plugin({
  runWithMdast(ctx: Context): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach((page: PageContent) => {
      if (page.demos) {
        const demoComponents: DemoComponent[] = [];

        page.demos.forEach((demo) => {
          const chunks: DemoComponentChunk[] = [];

          // Extract code chunks from demo ast like the original
          visit(demo.ast, 'code', (node: any) => {
            if (['component', 'template', 'styles'].includes(node.meta || '')) {
              chunks.push({
                snippet: node,
                code: node.value.replace(/\\{{/g, '{{'), // un-escape hbs
                ext: getExt(
                  node.lang || (node.meta === 'template' ? 'hbs' : 'js')
                ),
                type: node.meta as string
              });
            }
          });

          if (chunks.length > 0) {
            // Generate component name like the original ember implementation
            const baseName = page.source.replace('/index.md', '').split('.')[0];
            const componentName = generateDemoComponentName(
              `docfy-demo-${baseName}-${
                path.basename(demo.source).split('.')[0]
              }`,
              seenNames
            );

            // Find demo title heading like the original
            const demoTitle = findNode(
              demo.ast,
              (node: any) => node.type === 'heading' && node.depth === 1
            );

            let description: DemoComponent['description'] | undefined;
            if (demoTitle) {
              // Mark heading for deletion by TOC plugin
              demoTitle.depth = 3;
              demoTitle.data = {
                ...(demoTitle.data || {}),
                id: componentName.dashCase,
                docfyDelete: true
              };

              description = {
                title: toString(demoTitle),
                editUrl: demo.meta?.editUrl
              };
            }

            demoComponents.push({
              name: componentName.pascalCase,
              chunks,
              description
            });

            // Delete used code blocks like the original
            chunks.forEach(({ snippet }) => {
              if (demo.ast && Array.isArray(demo.ast.children)) {
                deleteNode(demo.ast.children, snippet);
              }
            });
          }
        });

        // Store demo components in pluginData for the GJS generator to consume
        if (!page.pluginData) {
          page.pluginData = {};
        }
        page.pluginData.demoComponents = demoComponents;

        // Handle manual demo insertion if enabled
        replaceDemoMarkers(page, demoComponents);
      }
    });
  }
});
