import glob from 'glob';
import fs from 'fs';
import path from 'path';
import trough from 'trough';
import { Node } from 'unist';
import { Page, Context, Options } from './types';
import { inferTitle, generateUrl, parseFrontmatter } from './utils';
import { createRemark } from './remark';
import { fixUrls, combineDemos, toc } from './plugins';

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

function createPage(
  source: string,
  markdown: string,
  ast: Node,
  urlPrefix?: string,
  urlSuffix?: string
): Page {
  const frontmatter = parseFrontmatter(source, ast);

  return {
    source,
    ast,
    markdown,
    metadata: {
      title: inferTitle(ast),
      ...frontmatter,
      url: generateUrl(source, frontmatter, urlPrefix, urlSuffix)
    },
    rendered: ''
  };
}

function initialize(options: Options): Context {
  const ctx: Context = {
    root: options.root,
    remark: createRemark(options.remarkPlugins),
    pages: [],
    settings: {
      tocMaxDepth: options.tocMaxDepth || 6
    }
  };

  options.sources.forEach((item) => {
    const files = glob.sync(item.pattern, {
      root: options.root,
      ignore: [...DEFAULT_IGNORE, ...(item.ignore || [])]
    });

    files.forEach((file) => {
      const relativePath = file.replace(path.join(options.root, '/'), '');
      const markdown = fs.readFileSync(file).toString();
      const ast = ctx.remark.runSync(ctx.remark.parse(markdown));

      ctx.pages.push(
        createPage(relativePath, markdown, ast, item.urlPrefix, item.urlSuffix)
      );
    });
  });

  return ctx;
}

function renderMarkdown(context: Context): void {
  context.pages.forEach((item) => {
    item.rendered = context.remark.stringify(item.ast);
  });
}

export default function (options: Options): Promise<Page[]> {
  return new Promise((resolve, reject) => {
    trough<Context>()
      .use<Options>(initialize)
      .use(combineDemos)
      .use(fixUrls)

      // Make sure TOC and renderMarkdown pluings are the last ones
      .use(toc)
      .use(renderMarkdown)
      .run(options, (err: unknown, ctx: Context): void => {
        if (err) {
          reject(err);
        } else {
          resolve(ctx.pages);
        }
      });
  });
}
