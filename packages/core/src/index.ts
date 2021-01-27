import glob from 'fast-glob';
import path from 'path';
import trough, { Through } from 'trough';
import toVfile from 'to-vfile';
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
  inferTitle
} from './-private/utils';
import { createRehype, createRemark } from './-private/remark';
import {
  combineDemos,
  renderMarkdown,
  replaceInternalLinks,
  staticAssets,
  toc,
  uniquefyUrls,
  removeUnnecessaryIndex
} from './plugins';
import { getRepoEditUrl } from './-private/repo-info';
import { transformToNestedPageMetadata } from './-private/nested-page-metadata';
import debugFactory from 'debug';
const debug = debugFactory('@docfy/core');

interface PluginOptions {
  [key: string]: unknown;
}

type PluginFn<T = PluginOptions> = (
  ctx: Context,
  options?: T
) => Context | void;

interface PluginObj<T = PluginOptions> {
  transformMdast?: PluginFn<T>;
  transformHast?: PluginFn<T>;
  default?: PluginFn<T>;
}

type Plugin<T = PluginOptions> =
  | (PluginFn<T> | PluginObj<T>)
  | [PluginFn<T> | PluginObj<T>, T];

type PluginWithOptions<T = PluginOptions> = [PluginFn<T>, T];

interface PluginPipeline {
  mdastTransformers: PluginWithOptions[];
  hastTransformers: PluginWithOptions[];
  defaults: PluginWithOptions[];
}

export default class Docfy {
  private pipeline: Through<Context>;
  private context: Context;
  private plugins: PluginPipeline;

  constructor(options: Options = {}) {
    const { remarkPlugins, rehypePlugins, ...rest } = options;

    this.context = {
      remark: createRemark(remarkPlugins),
      rehype: createRehype(rehypePlugins),
      pages: [],
      staticAssets: [],
      options: {
        ...rest,
        tocMaxDepth: rest.tocMaxDepth || 6
      }
    };

    const plugins: Plugin[] = [
      combineDemos,
      removeUnnecessaryIndex,
      uniquefyUrls,
      replaceInternalLinks,
      staticAssets
    ];

    if (Array.isArray(options.plugins)) {
      plugins.push(...options.plugins);
    }

    // Make sure TOC and renderMarkdown plugins are the last ones
    plugins.push(toc, renderMarkdown);
    this.plugins = this.createPluginPipeline(plugins);

    this.pipeline = trough<Context>()
      .use<SourceConfig[]>(this.initializePipeline.bind(this))
      .use(this.runMdastTransformers.bind(this))
      .use(this.runHastTransformers.bind(this))
      .use(this.runDefaultPlugins.bind(this));
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

  private runMdastTransformers(ctx: Context): void {
    this.plugins.mdastTransformers.forEach(([fn, options]) => {
      fn(ctx, options);
    });
  }

  private runHastTransformers(ctx: Context): void {
    ctx.pages.forEach((page) => {
      const hast = this.context.rehype.runSync(page.ast, page.vFile);
      page.ast = hast;

      page.demos?.forEach((demo) => {
        const hast = this.context.rehype.runSync(demo.ast, demo.vFile);
        demo.ast = hast;
      });
    });

    this.plugins.hastTransformers.forEach(([fn, options]) => {
      fn(ctx, options);
    });
  }

  private runDefaultPlugins(ctx: Context): void {
    this.plugins.defaults.forEach(([fn, options]) => {
      fn(ctx, options);
    });
  }

  private createPluginPipeline(plugins: Plugin[]): PluginPipeline {
    const result: PluginPipeline = {
      mdastTransformers: [],
      hastTransformers: [],
      defaults: []
    };

    const add = (fn: PluginFn | PluginObj, options: PluginOptions): void => {
      if (typeof fn !== 'function') {
        if (fn.transformHast) {
          result.hastTransformers.push([fn.transformHast, options]);
        }

        if (fn.transformMdast) {
          result.mdastTransformers.push([fn.transformMdast, options]);
        }

        if (fn.default) {
          result.defaults.push([fn.default, options]);
        }
      } else {
        result.defaults.push([fn, options]);
      }
    };

    plugins.forEach((plugin) => {
      if (Array.isArray(plugin)) {
        add(plugin[0], plugin[1]);
      } else {
        add(plugin, {});
      }
    });

    return result;
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

      debug('Source Files', files);

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

    const vFile = toVfile.readSync(fullPath);
    const markdown = vFile.contents.toString();
    const parsed = this.context.remark.parse(vFile);
    const ast = this.context.remark.runSync(parsed, vFile);

    const frontmatter: Record<string, unknown> =
      (vFile.data as { frontmatter?: Record<string, unknown> }).frontmatter ||
      {};

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
      vFile,
      ast,
      markdown,
      rendered: '',
      pluginData: {}
    };
  }
}
