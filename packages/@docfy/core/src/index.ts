import glob from 'fast-glob';
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
} from './-private/utils';
import { createRemark } from './-private/remark';
import {
  combineDemos,
  renderMarkdown,
  replaceInternalLinks,
  toc
} from './plugins';
import { getRepoEditUrl } from './-private/repo-info';
export { transformOutput } from './-private/output';

function createPage(
  source: string,
  markdown: string,
  ast: Node,
  urlSchema?: SourceSettings['urlSchema'],
  urlPrefix?: string,
  urlSuffix?: string,
  repoEditUrl?: string | null
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

  // Add fallback order for index pages
  if (
    url.length > 0 &&
    url[url.length - 1] === '/' &&
    typeof frontmatter.order === 'undefined'
  ) {
    (frontmatter.order as undefined | number) = -1;
  }

  let editUrl = '';

  if (repoEditUrl) {
    editUrl = repoEditUrl.replace('{filepath}', source);
  }

  return {
    source,
    ast,
    markdown,
    title,
    url,
    editUrl,
    headings: [],
    metadata: frontmatter,
    rendered: ''
  };
}

export default class Docfy {
  private pipeline: Through<Context>;
  private context: Context;

  constructor(options: Options = {}) {
    const { remarkPlugins, ...rest } = options;
    this.context = {
      remark: createRemark(remarkPlugins),
      pages: [],
      options: {
        ...rest,
        tocMaxDepth: rest.tocMaxDepth || 6
      }
    };

    this.pipeline = trough<Context>()
      .use<SourceSettings[]>(this.initializePipeline.bind(this))
      .use(combineDemos)
      .use(replaceInternalLinks);

    if (Array.isArray(options.plugins)) {
      options.plugins.forEach((item) => {
        this.pipeline.use(item);
      });
    }

    // Make sure TOC and renderMarkdown plugins are the last ones
    this.pipeline.use(toc).use(renderMarkdown);
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
      const repoEditUrl = getRepoEditUrl(
        item.root,
        item.repository?.url || ctx.options.repository?.url || '',
        item.repository?.editBranch || ctx.options.repository?.editBranch
      );
      const files = glob.sync(item.pattern, {
        cwd: item.root,

        ignore: [...DEFAULT_IGNORE, ...(item.ignore || [])],
        absolute: true
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
            item.urlSuffix,
            repoEditUrl
          )
        );
      });
    });

    return ctx;
  }
}
