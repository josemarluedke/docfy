import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import trough, { Through } from 'trough';
import { PageContent, Context, Options, SourceSettings } from './types';
import {
  DEFAULT_IGNORE,
  generateAutoUrl,
  generateManualUrl,
  inferTitle,
  parseFrontmatter
} from './-private/utils';
import { createRemark } from './-private/remark';
import {
  combineDemos,
  renderMarkdown,
  replaceInternalLinks,
  toc,
  uniquefyUrls
} from './plugins';
import { getRepoEditUrl } from './-private/repo-info';
export { transformOutput } from './-private/output';

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
      .use(uniquefyUrls)
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
        ctx.pages.push(this.createPage(item, file, repoEditUrl));
      });
    });

    return ctx;
  }

  private createPage(
    sourceConfig: SourceSettings,
    fullPath: string,
    repoEditUrl?: string | null
  ): PageContent {
    const relativePath = fullPath.replace(
      path.join(sourceConfig.root, '/'),
      ''
    );

    const markdown = fs.readFileSync(fullPath).toString();
    const ast = this.context.remark.runSync(
      this.context.remark.parse(markdown)
    );
    const frontmatter = parseFrontmatter(fullPath, ast);

    let url: string;
    let title = inferTitle(ast);
    if (typeof frontmatter.title === 'string') {
      title = frontmatter.title;
    }
    // Fallback for title
    if (typeof title === 'undefined' || title === '') {
      title = path.parse(fullPath).name;
    }

    if (sourceConfig.urlSchema === 'manual') {
      url = generateManualUrl(
        relativePath,
        frontmatter,
        sourceConfig.urlPrefix,
        sourceConfig.urlSuffix
      );
    } else {
      url = generateAutoUrl(
        relativePath,
        sourceConfig.urlPrefix,
        sourceConfig.urlSuffix
      );
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
      editUrl = repoEditUrl.replace('{filepath}', relativePath);
    }

    return {
      source: relativePath,
      ast,
      markdown,
      title,
      url,
      editUrl,
      headings: [],
      frontmatter: frontmatter,
      rendered: ''
    };
  }
}
