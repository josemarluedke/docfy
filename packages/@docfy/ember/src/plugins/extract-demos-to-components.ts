import visit from 'unist-util-visit';
import { Context, PageContent } from '@docfy/core/lib/types';
import { Node } from 'unist';
import findNode from 'unist-util-find';
import u from 'unist-builder';
import toString from 'mdast-util-to-string';

interface Literal {
  value: string;
}

interface CodeNode extends Node, Literal {
  type: 'code';
  lang?: string;
  meta?: string;
}

interface DemoComponent {
  name: ComponentName;
  chunks: ComponentChunk[];
  description?: {
    title?: string;
    ast: Node;
    editUrl?: string;
  };
}

interface ComponentName {
  dashCase: string;
  pascalCase: string;
}

interface ComponentChunk {
  type: string;
  code: string;
  ext: string;
  snippet: Node;
}

const MAP_LANG_TO_EXT = {
  javascript: 'js',
  typescript: 'ts',
  handlebars: 'hbs',
  'html.hbs': 'hbs',
  'html.handlebars': 'hbs'
};

/*
 * It returns the file extension from a lang string.
 */
function getExt(lang: string): string {
  lang = lang.toLowerCase();
  return MAP_LANG_TO_EXT[lang] || lang;
}

/*
 * Delete a node from a list of nodes
 */
function deleteNode(nodes: unknown, nodeToDelete: Node | undefined): void {
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
function generateComponentName(source: string): ComponentName {
  const dashCase = source
    .split('.')[0]
    .toLowerCase()
    .replace(/\/|\\/g, '-')
    .replace(/[^a-zA-Z0-9|-]/g, '');

  const pascalCase = dashCase
    .replace(/(\w)(\w*)/g, function (_, g1, g2) {
      return `${g1.toUpperCase()}${g2.toLowerCase()}`;
    })
    .replace(/-/g, '');
  return {
    dashCase,
    pascalCase
  };
}

/**
 * Creates all the Nodes necessary to render a Demo Component.
 *
 * It will render something like the follwing:
 * ```hbs
 * <DocfyDemo as |demo|>
 *   <demo.Example>
 *     <ComponentName />
 *   </demo.Example>
 *   <demo.Description @title="Heading depth 1" @editUrl="url">
 *     Demo markdown content
 *   </demo.Description>
 *   <demo.Snippets as |Snippet|>
 *     <Snippet @name="component">
 *       Code Snippet (with any highlight applied from remark)
 *     </Snippet>
 *   </demo.Snippets>
 * </DocfyDemo>
 * ```
 */
function createDemoNodes(component: DemoComponent): Node[] {
  const nodes: Node[] = [
    u('html', `<DocfyDemo @id="${component.name.dashCase}" as |demo|>`)
  ];

  nodes.push(
    u('html', '<demo.Example>'),
    u('html', `<${component.name.pascalCase} />`),
    u('html', '</demo.Example>')
  );

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

  nodes.push(u('html', '<demo.Snippets as |Snippet|>'));
  component.chunks.forEach((chunk) => {
    nodes.push(
      u('html', `<Snippet @name="${chunk.type}">`),
      chunk.snippet,
      u('html', '</Snippet>')
    );
  });
  nodes.push(u('html', '</demo.Snippets>'));

  nodes.push(u('html', '</DocfyDemo>'));
  return nodes;
}

/*
 * Create the heading fro the examples section of the page.
 *
 * It uses the remark stck to make sure any plugins that manage headings can be
 * executed.
 *
 * This is necessary for apps using remark-autolink-headings for example.
 */
function createHeading(ctx: Context): Node {
  const heading = (ctx.remark.runSync(ctx.remark.parse('## Examples'))
    .children as Node[])[0];
  heading.depth = 2;
  return heading;
}

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

export default function extractDemosToComponents(ctx: Context): void {
  ctx.pages.forEach((page) => {
    if (page.demos) {
      const demoComponents: DemoComponent[] = [];

      page.demos.forEach((demo) => {
        const chunks: ComponentChunk[] = [];

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

        const demoTitle = findNode(
          demo.ast,
          (node: Node) => node.type === 'heading' && node.depth === 1
        );

        demoComponents.push({
          name: generateComponentName(demo.source),
          chunks,
          description: {
            title: demoTitle ? toString(demoTitle) : undefined,
            ast: demo.ast,
            editUrl: demo.meta.editUrl
          }
        });

        // Delete used code blocks and title from demo markdown
        deleteNode(demo.ast.children, demoTitle);
        chunks.forEach(({ snippet }) => {
          deleteNode(demo.ast.children, snippet);
        });
      });

      const toInsert: Node[] = [createHeading(ctx)];
      demoComponents.forEach((component) => {
        toInsert.push(...createDemoNodes(component));
      });

      insertDemoNodesIntoPage(page, toInsert);
      page.pluginData.demoComponents = demoComponents;
    }
  });
}
