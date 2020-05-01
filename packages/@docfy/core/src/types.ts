import { Node } from 'unist';
import { Processor, Plugin, Settings } from 'unified';

export interface Heading {
  title: string;
  id: string;
  depth: number;
  headings?: Heading[];
}

export interface Page {
  source: string;
  url: string;
  editUrl: string;
  title: string;
  headings: Heading[];
  metadata: Record<string, unknown>;
}

export interface PageContent extends Page {
  ast: Node;
  markdown: string;
  rendered: string;
  demos?: PageContent[];
}

interface ContextOptions
  extends Omit<Options, 'remarkPlugins' | 'tocMaxDepth'> {
  tocMaxDepth: number;
}

export interface Context {
  remark: Processor;
  pages: PageContent[];
  options: ContextOptions;
}

export interface NestedRuntimeOutput {
  name: string;
  label: string;
  pages: Page[];
  children: NestedRuntimeOutput[];
}

export interface RuntimeOutput {
  flat: Page[];
  nested: NestedRuntimeOutput;
}

export interface SourceSettings {
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

export interface Options {
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
  remarkPlugins?: ([Plugin, Settings] | Plugin)[];

  /**
   * The max depth of headings
   * @default 6
   */
  tocMaxDepth?: number;

  /**
   * The repository config
   */
  repository?: RepositoryConfig;
}

interface DocfyConfigSourceSettings extends Omit<SourceSettings, 'root'> {
  root?: string;
}

export interface DocfyConfig extends Options {
  sources: DocfyConfigSourceSettings[];
  labels?: Record<string, string>;
}
