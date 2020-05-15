import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import trough, { Through } from 'trough';
import {
  PageContent,
  Context,
  Options,
  SourceConfig,
  PageMetadata,
  DocfyResult
} from './types';
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
  staticAssets,
  toc,
  uniquefyUrls
} from './plugins';
import { getRepoEditUrl } from './-private/repo-info';
import { transformToNestedPageMetadata } from './-private/nested-page-metadata';

export default class Docfy {
  private pipeline: Through<Context>;
  private context: Context;

  constructor(options: Options = {}) {
    const { remarkPlugins, ...rest } = options;
    this.context = {
      remark: createRemark(remarkPlugins),
      pages: [],
      staticAssets: [],
      options: {
        ...rest,
        tocMaxDepth: rest.tocMaxDepth || 6
      }
    };

    this.pipeline = trough<Context>()
      .use<SourceConfig[]>(this.initializePipeline.bind(this))
      .use(combineDemos)
      .use(uniquefyUrls)
      .use(replaceInternalLinks)
      .use(staticAssets);

    if (Array.isArray(options.plugins)) {
      options.plugins.forEach((item) => {
        this.pipeline.use(item);
      });
    }

    // Make sure TOC and renderMarkdown plugins are the last ones
    this.pipeline.use(toc).use(renderMarkdown);
  }

  public run(sources: SourceConfig[]): Promise<DocfyResult> {
    return new Promise((resolve, reject) => {
      this.pipeline.run(sources, (err: unknown, ctx: Context): void => {
        if (err) {
          reject(err);
        } else {
          resolve({
            content: ctx.pages,
            staticAssets: ctx.staticAssets,
            nestedPageMetadata: transformToNestedPageMetadata(
              ctx.pages.map((p) => p.meta),
              ctx.options.labels
            )
          });
        }
      });
    });
  }

  private initializePipeline(sources: SourceConfig[]): Context {
    const ctx = this.context;

    sources.forEach((item) => {
      let repoEditUrl: string | null;

      if (item.repository || ctx.options.repository) {
        repoEditUrl = getRepoEditUrl(
          item.root,
          item.repository?.url || ctx.options.repository?.url || '',
          item.repository?.editBranch || ctx.options.repository?.editBranch
        );
      }
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
    sourceConfig: SourceConfig,
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

    if (typeof frontmatter.url === 'string') {
      url = generateAutoUrl(
        frontmatter.url,
        sourceConfig.urlPrefix,
        sourceConfig.urlSuffix
      );
    } else if (sourceConfig.urlSchema === 'manual') {
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

    const metadata: PageMetadata = {
      url,
      title,
      editUrl,
      relativeUrl: undefined,
      headings: [],
      frontmatter: frontmatter,
      pluginData: {}
    };

    return {
      meta: metadata,
      source: relativePath,
      sourceConfig,
      ast,
      markdown,
      rendered: '',
      pluginData: {}
    };
  }
}
