import glob from 'glob';
import fs from 'fs';
import path from 'path';
import trough, { Through } from 'trough';
import { Node } from 'unist';
import { PageContent, Context, Options, SourceSettings } from './types';
import {
  inferTitle,
  generateManualUrl,
  generateAutoUrl,
  parseFrontmatter,
  DEFAULT_IGNORE
} from './utils';
import { createRemark } from './remark';
import { combineDemos, fixUrls, renderMarkdown, toc } from './plugins';

function createPage(
  source: string,
  markdown: string,
  ast: Node,
  urlSchema?: SourceSettings['urlSchema'],
  urlPrefix?: string,
  urlSuffix?: string
): PageContent {
  const frontmatter = parseFrontmatter(source, ast);
  let url: string;
  let title = inferTitle(ast);
  if (typeof frontmatter.title === 'string') {
    title = frontmatter.title;
  }
  // Fallback for title
  if (typeof title === 'undefined' || title === '') {
    title = path.parse(source).name;
  }

  if (urlSchema === 'manual') {
    url = generateManualUrl(source, frontmatter, urlPrefix, urlSuffix);
  } else {
    url = generateAutoUrl(source, urlPrefix, urlSuffix);
  }

  return {
    source,
    ast,
    markdown,
    title,
    url,
    headings: [],
    metadata: frontmatter,
    rendered: ''
  };
}

export default class Docfy {
  private pipeline: Through<Context>;
  private context: Context;

  constructor(options: Options = {}) {
    this.context = {
      remark: createRemark(options.remarkPlugins),
      pages: [],
      options: {
        tocMaxDepth: options.tocMaxDepth || 6
      }
    };

    this.pipeline = trough<Context>()
      .use<SourceSettings[]>(this.initializePipeline.bind(this))
      .use(combineDemos)
      .use(fixUrls)

      // Make sure TOC and renderMarkdown plugins are the last ones
      .use(toc)
      .use(renderMarkdown);
  }

  public run(sources: SourceSettings[]): Promise<PageContent[]> {
    return new Promise((resolve, reject) => {
      this.pipeline.run(sources, (err: unknown, ctx: Context): void => {
        if (err) {
          reject(err);
        } else {
          resolve(ctx.pages);
        }
      });
    });
  }

  private initializePipeline(sources: SourceSettings[]): Context {
    const ctx = this.context;

    sources.forEach((item) => {
      const files = glob.sync(item.pattern, {
        root: item.root,
        ignore: [...DEFAULT_IGNORE, ...(item.ignore || [])]
      });

      files.forEach((file) => {
        const relativePath = file.replace(path.join(item.root, '/'), '');
        const markdown = fs.readFileSync(file).toString();
        const ast = ctx.remark.runSync(ctx.remark.parse(markdown));

        ctx.pages.push(
          createPage(
            relativePath,
            markdown,
            ast,
            item.urlSchema,
            item.urlPrefix,
            item.urlSuffix
          )
        );
      });
    });

    return ctx;
  }
}
