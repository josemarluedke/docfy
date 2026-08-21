import { visit, EXIT } from 'unist-util-visit';
import type { Heading, Html, Root, RootContent } from 'mdast';
import type { DemoComponent, DemoComponentName } from '../types.js';

// Map language names to file extensions (same as original ember implementation)
const MAP_LANG_TO_EXT = {
  javascript: 'js',
  typescript: 'ts',
  handlebars: 'hbs',
  'html.hbs': 'hbs',
  'html.handlebars': 'hbs',
};

export function getExt(lang: string): string {
  lang = lang.toLowerCase();
  return MAP_LANG_TO_EXT[lang] || lang;
}

/**
 * Checks if a property is of type DemoComponent[]
 */
export function isDemoComponents(components: unknown): components is DemoComponent[] {
  if (
    Array.isArray(components) &&
    typeof components[0] == 'object' &&
    {}.hasOwnProperty.call(components[0], 'name') &&
    {}.hasOwnProperty.call(components[0], 'chunks')
  ) {
    return true;
  }
  return false;
}

/*
 * Builds a raw `html` mdast node.
 *
 * This replaces `unist-builder`'s `u('html', value)`, which returned an untyped
 * node. `html` is a real mdast node type, so the literal is all we need.
 */
export function html(value: string): Html {
  return { type: 'html', value };
}

/*
 * Finds the first heading in the tree matching a predicate.
 *
 * This replaces `unist-util-find`, which is unmaintained and returns a bare
 * unist `Node` — losing `depth` and `data` and forcing a cast at every call
 * site.
 */
export function findHeading(tree: Root, test: (node: Heading) => boolean): Heading | undefined {
  let found: Heading | undefined;

  visit(tree, 'heading', node => {
    if (test(node)) {
      found = node;
      return EXIT;
    }
  });

  return found;
}

// Utility functions (same as original ember implementation)
export function replaceNode(
  nodes: RootContent[],
  nodeToReplace: RootContent,
  ...newNodes: RootContent[]
): void {
  const index = nodes.findIndex(item => item === nodeToReplace);

  if (index !== -1) {
    nodes.splice(index, 1, ...newNodes);
  }
}

export function createDemoNodes(component: DemoComponent): RootContent[] {
  const nodes: RootContent[] = [html(`<DocfyDemo @id="${component.name.dashCase}" as |demo|>`)];

  if (component.description) {
    nodes.push(
      html(
        `<demo.Description
          ${component.description.title ? `@title="${component.description.title}" ` : ''}${
            component.description.editUrl ? `@editUrl="${component.description.editUrl}"` : ''
          }>`
      ),
      // The demo's description is a whole `Root`. mdast has no node type for a
      // nested tree, but `mdast-util-to-hast` has a `root` handler, so it is
      // rendered inline where it sits.
      component.description.ast as unknown as RootContent,
      html('</demo.Description>')
    );
  }

  nodes.push(
    html('<demo.Example>'),
    html(`<${component.name.pascalCase} />`),
    html('</demo.Example>')
  );

  if (component.chunks.length > 1) {
    nodes.push(html('<demo.Snippets as |Snippet|>'));
    component.chunks.forEach(chunk => {
      nodes.push(html(`<Snippet @name="${chunk.type}">`), chunk.snippet, html('</Snippet>'));
    });
    nodes.push(html('</demo.Snippets>'));
  } else {
    component.chunks.forEach(chunk => {
      nodes.push(
        html(`<demo.Snippet @name="${chunk.type}">`),
        chunk.snippet,
        html('</demo.Snippet>')
      );
    });
  }

  nodes.push(html('</DocfyDemo>'));

  return nodes;
}
/*
 * Delete a node from a list of nodes
 */
export function deleteNode(nodes: RootContent[], nodeToDelete: RootContent | undefined): void {
  if (!nodeToDelete) {
    return;
  }

  const index = nodes.findIndex(item => item === nodeToDelete);

  if (index !== -1) {
    nodes.splice(index, 1);
  }
}

/*
 * Generate the component name from the source path of the demo
 *
 * It returns both dash case and pastal case.
 * The dash-case can be used for the file name and the PascalCase for the
 * rendering of the component.
 */
export function generateDemoComponentName(
  identifier: string,
  seenNames: Set<string>,
  tentativeCount = 1
): DemoComponentName {
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
    return generateDemoComponentName(`${dashCase}${tentativeCount}`, seenNames, tentativeCount + 1);
  }

  seenNames.add(dashCase);
  return {
    dashCase,
    pascalCase,
  };
}
