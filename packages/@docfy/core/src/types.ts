import { Node as MarkdownAST } from 'unist';
import {
  Processor,
  Plugin as RemarkPlugin,
  Settings as RemarkSettings
} from 'unified';

export interface Heading {
  title: string;
  id: string;
  depth: number;
  headings?: Heading[];
}

export interface PageMetadata {
  url: string;
  relativeUrl: undefined | string;
  editUrl: string;
  title: string;
  headings: Heading[];
  frontmatter: Record<string, unknown>;
  pluginData: Record<string, unknown>;
}

export interface PageContent {
  meta: PageMetadata;
  sourceConfig: SourceConfig;
  source: string;
  ast: MarkdownAST;
  markdown: string;
  rendered: string;
  demos?: PageContent[];
  pluginData: Record<string, unknown>;
}

interface ContextOptions
  extends Omit<Options, 'plugins' | 'remarkPlugins' | 'tocMaxDepth'> {
  tocMaxDepth: number;
}

export interface Context {
  remark: Processor;
  pages: PageContent[];
  options: ContextOptions;
}

export interface NestedPageMetadata {
  name: string;
  label: string;
  pages: PageMetadata[];
  children: NestedPageMetadata[];
}

export interface DocfyResult {
  content: PageContent[];
  nestedPageMetadata: NestedPageMetadata;
}

export interface SourceConfig {
  /**
   * The absolute path to where the files are located.
   */
  root: string;

  /**
   * Match files using the patterns the shell uses, like stars and stuff. It
   * uses Glob package.
   */
  pattern: string;

  /**
   * Pattern to ignore.
   */
  ignore?: string[];

  /**
   * Option to change how urls are generated.
   *
   * There are two ways URLs can ge generated.
   *
   * 1. "auto": Uses the folder structure to inform how the urls are generated.
   *    For example, if you have the folowing files:
   *      - install.md
   *      - components/
   *        - button.md
   *        - card.md
   *    The urls would look like this, (assuming urlPrefix is set to "docs").
   *      - docs/install
   *      - docs/components/buttons
   *      - docs/components/card
   *
   * 2. "manual": It uses frontmatter information to inform "subcategory" and
   *    "category" of the file, ignoring the original file location.
   *    The url schema is as follows:
   *    {category}/{subcategory}/{file-name}
   *
   *    If no category or subcategory is specified, all files will be at the root
   *    level.
   *
   *    This options is perfect for documenting monorepo projects while keeping
   *    documentation next to implementation.
   */
  urlSchema?: 'auto' | 'manual';

  /**
   * Option to prefix the urls.
   *
   * For example:
   * "docs" will generate urls like "/docs/something"
   * "blog" will generate urls like "/blog/something"
   */
  urlPrefix?: string;

  /**
   * Option to suffix the urls.
   *
   * For example:
   * ".html" will generate urls like "/something.html"
   */
  urlSuffix?: string;

  /**
   * Overwrite repository config for this source.
   */
  repository?: RepositoryConfig;
}

interface RepositoryConfig {
  /**
   *
   * The url to the Git Repository
   * Example: https://github.com/josemarluedke/docfy
   */
  url: string;

  /**
   * Branch used to edit your markdown when clicking on "Edit this page" button.
   * @default "master"
   */
  editBranch?: string;
}

export type Plugin = (ctx: Context) => void | Context; // eslint-disable-line

export interface Options {
  plugins?: Plugin[];

  /**
   * Additional remark plugins
   *
   * Example:
   *
   * ```js
   * const hbs = require('remark-hbs');
   * const autolinkHeadings = require('remark-autolink-headings');
   *
   * const remarkPlugins = [
   *   [
   *     autolinkHeadings,
   *     {
   *       behavior: 'wrap'
   *     }
   *   ],
   *   hbs
   * ];
   * ```
   */
  remarkPlugins?: ([RemarkPlugin, RemarkSettings] | RemarkPlugin)[];

  /**
   * The max depth of headings
   * @default 6
   */
  tocMaxDepth?: number;

  /**
   * The repository config
   */
  repository?: RepositoryConfig;

  /**
   * Labels to be used while generating nestedPageMetadata
   */
  labels?: Record<string, string>;
}

interface DocfyConfigSourceConfig extends Omit<SourceConfig, 'root'> {
  root?: string;
}

export interface DocfyConfig extends Options {
  sources: DocfyConfigSourceConfig[];
}
