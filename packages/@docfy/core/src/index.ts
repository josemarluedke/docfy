import glob from 'glob';
import fs from 'fs';
import path from 'path';
import unified from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import html from 'remark-html';
import stringify from 'remark-stringify';
import visit from 'unist-util-visit';
import YAML from 'yaml';
import { Node } from 'unist';
import { Content, Context } from './types';
import combineDemos from './combine-demos';
import normalizeHeadings from 'remark-normalize-headings';
import { getTitlteFomMarkdown, generateUrl } from './utils';
import trough from 'trough';

const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/tmp/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'tmp/**',
  'dist/**'
];

function parseFrontmatter(source: string, ast: Node): object {
  visit(ast, 'yaml', (node) => {
    try {
      return YAML.parse(node.value as string);
    } catch (e) {
      console.error(`Error while parsing frontmatter in ${source}: `, e);
    }
  });

  return {};
}

function addContent(source: string, markdown: string, ast: Node): Content {
  const frontmatter = parseFrontmatter(source, ast);

  return {
    source,
    ast,
    markdown,
    metadata: {
      title: getTitlteFomMarkdown(ast),
      ...frontmatter,
      url: generateUrl(source, frontmatter)
    },
    rendered: ''
  };
}

interface InputOptions {
  prefix: string;
  pattern: string;
  ignore?: string[];
}

interface Options {
  root: string;
  input: InputOptions[];
  remarkPlugins: Function[];
}

function initialize(options: Options): Context {
  const stack = unified()
    .use(parse)
    .use(normalizeHeadings)
    .use(stringify)
    .use(frontmatter, [{ type: 'yaml', marker: '-' }]);

  options.remarkPlugins.forEach((fn) => {
    stack.use(fn as never);
  });

  stack.use(html);
  const ctx: Context = {
    unified: stack,
    contents: []
  };

  options.input.forEach((item) => {
    const files = glob.sync(item.pattern, {
      root: options.root,
      ignore: [...DEFAULT_IGNORE, ...(item.ignore || [])]
    });

    files.forEach((file) => {
      const relativePath = file.replace(path.join(options.root, '/'), '');
      const markdown = fs.readFileSync(file).toString();
      const ast = stack.runSync(stack.parse(markdown));

      ctx.contents.push(addContent(relativePath, markdown, ast));
    });
  });

  return ctx;
}

function renderMarkdown(context: Context): void {
  context.contents.forEach((item) => {
    item.rendered = context.unified.stringify(item.ast);
  });
}

export default function (options: Options): Promise<Content[]> {
  return new Promise((resolve, reject) => {
    trough()
      .use(initialize)
      .use(combineDemos)
      .use(renderMarkdown)
      .run(options, function (err: unknown, ctx: Context): void {
        if (err) {
          reject(err);
        } else {
          resolve(ctx.contents);
        }
      });
  });
}
