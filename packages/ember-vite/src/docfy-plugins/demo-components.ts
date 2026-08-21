import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import path from 'path';
import {
  generateDemoComponentName,
  getExt,
  createDemoNodes,
  deleteNode,
  findHeading,
  isDemoComponents,
} from './utils.js';

import type { Context, PageContent } from '@docfy/core/lib/types.js';
import type { DemoComponent, DemoComponentChunk, PluginData } from '../types.js';
import type { Heading, Paragraph, Root, RootContent } from 'mdast';

/*
 * Create the heading for the examples section of the page.
 *
 * It uses the remark stack to make sure any plugins that manage headings can be
 * executed.
 *
 * This is necessary for apps using remark-autolink-headings, for example.
 */
function createHeading(ctx: Context<Root>): Heading {
  // `## Examples` always parses to a single heading. Remark plugins in the
  // stack can annotate it, but none of them replace it with another node type.
  const heading = ctx.remark.runSync(ctx.remark.parse('## Examples')).children[0] as Heading;
  heading.depth = 2;
  return heading;
}

/*
 * Returns the text of a paragraph made up of a single text node, which is the
 * shape every demo marker has.
 */
function markerText(node: Paragraph): string {
  const child = node.children[0];
  return node.children.length === 1 && child.type === 'text' ? child.value : '';
}

const demoMarkerRegex = /^\[\[demo:(.+?)\]\]$/;
const demoMarker = (node: Paragraph): boolean => demoMarkerRegex.test(markerText(node));

const demosAllMarkerRegex = /^\[\[demos-all\]\]$/;
const demosAllMarker = (node: Paragraph): boolean => demosAllMarkerRegex.test(markerText(node));

/*
 * Replaces a demo marker paragraph with the given demo nodes.
 *
 * The paragraph is retyped to `div` so that `mdast-util-to-hast` falls back to
 * its unknown-node handler and emits a plain `<div>`: a `<p>` cannot legally
 * wrap the block-level markup being spliced in. Neither retyping a node nor
 * putting block content inside a paragraph is expressible in mdast, so the
 * marker is widened here.
 */
function replaceMarkerWithDemoNodes(marker: Paragraph, nodes: RootContent[]): void {
  const container = marker as unknown as { type: string; children: RootContent[] };

  container.type = 'div';
  container.children.splice(0, 1, ...nodes);
}

/*
 * Insert Demo nodes into the page.
 */
function insertDemoNodesIntoPage(page: PageContent<Root>, toInsert: RootContent[]): void {
  const secondHeading = findHeading(page.ast, node => node.depth !== 1);

  if (secondHeading) {
    const index = page.ast.children.findIndex(el => el === secondHeading);
    page.ast.children.splice(index, 0, ...toInsert);
  } else {
    page.ast.children.push(...toInsert);
  }
}

function replaceDemoMarkers(page: PageContent<Root>, demos: DemoComponent[]): void {
  const markers: Paragraph[] = [];
  const allMarkers: Paragraph[] = [];

  visit(page.ast, 'paragraph', node => {
    if (demoMarker(node)) markers.push(node);
    if (demosAllMarker(node)) allMarkers.push(node);
  });

  markers.forEach(marker => {
    const matches = markerText(marker).match(demoMarkerRegex);
    if (!matches) return;

    // TODO: This is an inner loop and can cause perf issues if someone
    // out there has many demos on a single page. It would be better to
    // create a demo component hash that can be looked up by demo name.
    const demoName = matches[1];
    const demo = demos.find(d => d.name.dashCase.endsWith(demoName));

    if (!demo) {
      console.warn(
        `Found demo marker "${demoName}" with no matching demo component in ${page.source}`
      );
      return;
    }

    replaceMarkerWithDemoNodes(marker, createDemoNodes(demo));
  });

  allMarkers.forEach(marker => {
    const demoNodes = demos.map(component => createDemoNodes(component)).flat();

    replaceMarkerWithDemoNodes(marker, demoNodes);
  });
}

export default plugin({
  runWithMdast(ctx): void {
    const seenNames: Set<string> = new Set();

    ctx.pages.forEach(page => {
      if (page.demos) {
        const demoComponents: DemoComponent[] = [];

        page.demos.forEach(demo => {
          const chunks: DemoComponentChunk[] = [];

          visit(demo.ast, 'code', node => {
            if (['component', 'template', 'styles'].includes(node.meta || '')) {
              chunks.push({
                snippet: node,
                code: node.value.replace(/\\{{/g, '{{'), // un-escape hbs
                ext: getExt(node.lang || (node.meta === 'template' ? 'hbs' : 'js')),
                type: node.meta as string,
              });
            }
          });

          // 1. exclude extension
          // 2. remove /index.md because of web conventions
          const baseName = page.source.replace('/index.md', '').split('.')[0];

          const componentName = generateDemoComponentName(
            `docfy-demo-${baseName}-${path.basename(demo.source).split('.')[0]}`,
            seenNames
          );

          const demoTitle = findHeading(demo.ast, node => node.depth === 1);

          if (demoTitle) {
            demoTitle.depth = 3;
            demoTitle.data = {
              ...(demoTitle.data || {}),
              id: componentName.dashCase,
              docfyDelete: true, // mark the heading to be deleted by @docfy/core TOC plugin
            };
          }

          demoComponents.push({
            name: componentName,
            chunks,
            description: {
              title: demoTitle ? toString(demoTitle) : undefined,
              ast: demo.ast,
              editUrl: demo.meta.editUrl,
            },
          });

          // Delete used code blocks
          chunks.forEach(({ snippet }) => {
            deleteNode(demo.ast.children, snippet);
          });
        });

        if (page.meta.frontmatter.manualDemoInsertion) {
          // Manual demo insertion inserts demos into markdown files
          // wherever there is a demo marker ([[demo:name]] or [[demos-all]])
          replaceDemoMarkers(page, demoComponents);
        } else {
          // Automatic demo insertion creates an Example block after
          // the first heading.
          const toInsert: RootContent[] = [createHeading(ctx)];
          demoComponents.forEach(component => {
            toInsert.push(...createDemoNodes(component));
          });
          insertDemoNodesIntoPage(page, toInsert);
        }

        const pluginData = page.pluginData as PluginData;
        if (isDemoComponents(pluginData.demoComponents)) {
          pluginData.demoComponents.push(...demoComponents);
        } else {
          pluginData.demoComponents = demoComponents;
        }
      }
    });
  },
});
