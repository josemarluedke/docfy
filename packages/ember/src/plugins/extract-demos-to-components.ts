import visit from 'unist-util-visit';
import { Context, PageContent } from '@docfy/core/lib/types';
import plugin from '@docfy/core/lib/plugin';
import { Node, Parent } from 'unist';
import findNode from 'unist-util-find';
import toString from 'mdast-util-to-string';
import { DemoComponent, DemoComponentChunk, CodeNode } from './types';
import {
  generateDemoComponentName,
  getExt,
  createDemoNodes,
  deleteNode,
  isDemoComponents
} from './utils';
import path from 'path';

/*
 * Create the heading for the examples section of the page.
 *
 * It uses the remark stack to make sure any plugins that manage headings can be
 * executed.
 *
 * This is necessary for apps using remark-autolink-headings, for example.
 */
function createHeading(ctx: Context): Node {
  const heading = (
    ctx.remark.runSync(ctx.remark.parse('## Examples')).children as Node[]
  )[0];
  heading.depth = 2;
  return heading;
}

const demoMarkerRegex = /^\[\[demo:(.+?)\]\]$/;
const demoMarker = (node: Parent): boolean =>
  node.type === 'paragraph' &&
  node.children.length === 1 &&
  node.children[0].type === 'text' &&
  demoMarkerRegex.test(node.children[0].value as string);

/*
 * Insert Demo nodes into the page.
 */
function insertDemoNodesIntoPage(page: PageContent, toInsert: Node[]): void {
  if (Array.isArray(page.ast.children)) {
    const secondHeading = findNode(
      page.ast,
      (node: Node) => node.type === 'heading' && node.depth !== 1
    );

    if (secondHeading) {
      const index = page.ast.children.findIndex((el) => el === secondHeading);
      page.ast.children.splice(index, 0, ...toInsert);
    } else {
      page.ast.children.push(...toInsert);
    }
  }
}

function replaceDemoMarkers(page: PageContent, demos: DemoComponent[]): void {
  if (Array.isArray(page.ast.children)) {
    const markers: Parent[] = [];

    visit(page.ast, 'paragraph', (node: Parent) => {
      if (demoMarker(node)) markers.push(node);
    });

    markers.forEach((marker) => {
      const child = marker.children[0];
      const matches = (child.value as string).match(demoMarkerRegex);
      if (!matches) return;

      // TODO: This is an inner loop and can cause perf issues if someone
      // out there has many demos on a single page. It would be better to
      // create a demo component hash that can be looked up by demo name.
      const demoName = matches[1];
      const demo = demos.find((d) => d.name.dashCase.endsWith(demoName));

      if (!demo) {
        console.warn(
          `Found demo marker "${demoName}" with no matching demo component in ${page.source}`
        );
        return;
      }

      marker.children.splice(0, 1, ...createDemoNodes(demo));
    });
  }
}

export default plugin({
  runWithMdast(ctx: Context): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach((page) => {
      if (page.demos) {
        const demoComponents: DemoComponent[] = [];

        page.demos.forEach((demo) => {
          const chunks: DemoComponentChunk[] = [];

          visit(demo.ast, 'code', (node: CodeNode) => {
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

          // 1. exclude extension
          // 2. remove /index.md because of web conventions
          const baseName = page.source.replace('/index.md', '').split('.')[0];

          const componentName = generateDemoComponentName(
            `docfy-demo-${baseName}-${
              path.basename(demo.source).split('.')[0]
            }`,
            seenNames
          );

          const demoTitle = findNode(
            demo.ast,
            (node: Node) => node.type === 'heading' && node.depth === 1
          );

          if (demoTitle) {
            demoTitle.depth = 3;
            demoTitle.data = {
              ...(demoTitle.data || {}),
              id: componentName.dashCase,
              docfyDelete: true // mark the heading to be deleted by @docfy/core TOC plugin
            };
          }

          demoComponents.push({
            name: componentName,
            chunks,
            description: {
              title: demoTitle ? toString(demoTitle) : undefined,
              ast: demo.ast,
              editUrl: demo.meta.editUrl
            }
          });

          // Delete used code blocks
          chunks.forEach(({ snippet }) => {
            deleteNode(demo.ast.children, snippet);
          });
        });

        if (page.meta.frontmatter.manualDemoInsertion) {
          // Manual demo insertion inserts demos into markdown files
          // wherever there is a demo marker ([[demo:name]])
          replaceDemoMarkers(page, demoComponents);
        } else {
          // Automatic demo insertion creates an Example block after
          // the first heading.
          const toInsert: Node[] = [createHeading(ctx)];
          demoComponents.forEach((component) => {
            toInsert.push(...createDemoNodes(component));
          });
          insertDemoNodesIntoPage(page, toInsert);
        }

        if (isDemoComponents(page.pluginData.demoComponents)) {
          page.pluginData.demoComponents.push(...demoComponents);
        } else {
          page.pluginData.demoComponents = demoComponents;
        }
      }
    });
  }
});
