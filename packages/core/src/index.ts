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
  DocfyResult,
  Plugin,
  PluginList,
  PluginWithOptions,
  PluginWithOptionsFunction
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

class Docfy {
  private pipeline: Through<Context>;
  private context: Context;
  private plugins: PluginList;

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

    const plugins: PluginList = [
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
    this.plugins = plugins;

    this.pipeline = trough<Context>()
      .use<SourceConfig[]>(this.initializePipeline.bind(this))
      .use(this.createPluginPipelineFor('runBefore'))
      .use(this.createPluginPipelineFor('runWithMdast'))
      .use(this.transformerMdastToHast)
      .use(this.createPluginPipelineFor('runWithHast'))
      .use(this.createPluginPipelineFor('runAfter'));
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

  private transformerMdastToHast(ctx: Context): void {
    ctx.pages.forEach((page) => {
      const hast = ctx.rehype.runSync(page.ast, page.vFile);
      page.ast = hast;

      page.demos?.forEach((demo) => {
        const hast = ctx.rehype.runSync(demo.ast, demo.vFile);
        demo.ast = hast;
      });
    });
  }

  private createPluginPipelineFor(
    funcType: 'runBefore' | 'runAfter' | 'runWithMdast' | 'runWithHast'
  ): (ctx: Context) => void {
    function isPluginWithOptionsFunction(
      plugin: Plugin | PluginWithOptions | PluginWithOptionsFunction
    ): plugin is PluginWithOptionsFunction {
      return typeof plugin === 'function' && '__isOptionsFunction' in plugin;
    }

    function isPluginWithOptions(
      plugin: Plugin | PluginWithOptions | PluginWithOptionsFunction
    ): plugin is PluginWithOptions {
      return '__options' in plugin;
    }

    const plugins = this.plugins;

    return function (ctx: Context): void {
      plugins.forEach((plugin) => {
        let options: unknown;

        if (isPluginWithOptionsFunction(plugin)) {
          plugin = plugin();
        }

        if (isPluginWithOptions(plugin)) {
          options = plugin.__options;
        }

        const fn = plugin[funcType];
        if (fn) {
          fn(ctx, options as never);
        }
      });
    };
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

export default Docfy;
module.exports = Docfy;
