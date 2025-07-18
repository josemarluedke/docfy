import u from 'unist-builder';
import { Node } from 'unist';

export interface DemoComponentName {
  dashCase: string;
  pascalCase: string;
}

export interface DemoComponentChunk {
  type: string;
  code: string;
  ext: string;
  snippet: Node;
}

export interface DemoComponent {
  name: DemoComponentName;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    ast: Node;
    editUrl?: string;
  };
}

// Map language names to file extensions (same as original ember implementation)
const MAP_LANG_TO_EXT = {
  javascript: 'js',
  typescript: 'ts',
  handlebars: 'hbs',
  'html.hbs': 'hbs',
  'html.handlebars': 'hbs'
};

export function getExt(lang: string): string {
  lang = lang.toLowerCase();
  return MAP_LANG_TO_EXT[lang] || lang;
}

/**
 * Checks if a property is of type DemoComponent[]
 */
export function isDemoComponents(
  components: unknown
): components is DemoComponent[] {
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

// Utility functions (same as original ember implementation)
export function replaceNode(
  nodes: unknown,
  nodeToDelete: any,
  ...newNodes: any[]
): void {
  if (Array.isArray(nodes)) {
    const index = nodes.findIndex((item) => item === nodeToDelete);
    if (index !== -1) {
      nodes.splice(index, 1, ...newNodes);
    }
  }
}

export function createDemoNodes(component: DemoComponent): Node[] {
  const nodes: Node[] = [
    u('html', `<DocfyDemo @id="${component.name.dashCase}" as |demo|>`)
  ];

  if (component.description) {
    nodes.push(
      u(
        'html',
        `<demo.Description
          ${
            component.description.title
              ? `@title="${component.description.title}" `
              : ''
          }${
          component.description.editUrl
            ? `@editUrl="${component.description.editUrl}"`
            : ''
        }>`
      ),
      component.description.ast,
      u('html', '</demo.Description>')
    );
  }

  nodes.push(
    u('html', '<demo.Example>'),
    u('html', `<${component.name.pascalCase} />`),
    u('html', '</demo.Example>')
  );

  if (component.chunks.length > 1) {
    nodes.push(u('html', '<demo.Snippets as |Snippet|>'));
    component.chunks.forEach((chunk) => {
      nodes.push(
        u('html', `<Snippet @name="${chunk.type}">`),
        chunk.snippet,
        u('html', '</Snippet>')
      );
    });
    nodes.push(u('html', '</demo.Snippets>'));
  } else {
    component.chunks.forEach((chunk) => {
      nodes.push(
        u('html', `<demo.Snippet @name="${chunk.type}">`),
        chunk.snippet,
        u('html', '</demo.Snippet>')
      );
    });
  }

  nodes.push(u('html', '</DocfyDemo>'));

  return nodes;
}
/*
 * Delete a node from a list of nodes
 */
export function deleteNode(
  nodes: unknown,
  nodeToDelete: Node | undefined
): void {
  if (!nodeToDelete) {
    return;
  }

  if (Array.isArray(nodes)) {
    const index = nodes.findIndex((item) => item === nodeToDelete);

    if (index !== -1) {
      nodes.splice(index, 1);
    }
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
