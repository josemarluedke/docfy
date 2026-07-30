import type {
  DocfyResult,
  NestedPageMetadata,
  PageContent,
  PageMetadata,
} from '@docfy/core/lib/types';
import type { FileToGenerate } from './types.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:static-export');

/**
 * Options controlling the static text export of processed docs.
 * Off by default — opt in per consuming app.
 */
export interface StaticExportOptions {
  /** Master switch. @default false */
  enabled?: boolean;

  /** Emit one `<page-url>.md` file per page. @default true when enabled */
  markdown?: boolean;

  /** Emit `llms.txt` (compact index). @default true when enabled */
  llmsTxt?: boolean;

  /** Emit `llms-full.txt` (every page concatenated). @default true when enabled */
  llmsFullTxt?: boolean;

  /**
   * Absolute site origin used to build links in llms.txt / llms-full.txt,
   * e.g. "https://docfy.dev". Required when llmsTxt or llmsFullTxt is enabled.
   */
  siteUrl?: string;

  /** Optional short project blurb inserted at the top of llms.txt. */
  projectDescription?: string;

  /**
   * Optional project name emitted as the H1 heading at the top of llms.txt.
   * Per the llms.txt convention (https://llmstxt.org) the H1 project name is
   * the only required element. Omitted by default to keep this non-breaking.
   */
  projectName?: string;
}

/**
 * Matches a YAML frontmatter block only at the very start of the document, so
 * a `---` horizontal rule in the body is left alone.
 */
const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER_PATTERN, '');
}

/**
 * Convert a Docfy page URL into the static file name for its Markdown mirror.
 *
 * Docfy URLs always start with `/`, and index pages end with `/`. Without the
 * trailing-slash branch an index page at `/docs/` would produce `docs/.md`.
 */
export function markdownFileName(url: string): string {
  const relative = url.replace(/^\/+/, '');

  if (relative === '') {
    return 'index.md';
  }

  if (relative.endsWith('/')) {
    return `${relative}index.md`;
  }

  return `${relative}.md`;
}

/**
 * The Markdown payload to export for a page.
 *
 * `page.markdown` is the raw, untouched file source — no @docfy/core plugin
 * ever writes to it. Consuming apps that need transformed output (for example
 * replacing a custom component tag with a real Markdown table) set
 * `page.pluginData.staticMarkdown` from a Docfy plugin, which leaves the raw
 * field and the SPA route generation untouched.
 */
export function pageMarkdown(page: PageContent): string {
  const override = page.pluginData?.staticMarkdown;
  const source = typeof override === 'string' ? override : page.markdown;

  return stripFrontmatter(source).trim();
}

export interface FlatSection {
  label: string;
  pages: PageMetadata[];
  depth: number;
}

/**
 * Validate a `staticExport` configuration eagerly, before any processing
 * begins. Returns an error message describing the problem, or `undefined`
 * when the configuration is valid (or the feature isn't enabled at all).
 *
 * This mirrors the check `requireSiteUrl` performs deep in the emit path,
 * so callers (the Vite plugin's `buildStart`) can fail loudly up front
 * instead of relying on an exception thrown mid-build to surface the
 * problem. `requireSiteUrl` is kept as a defense-in-depth backstop.
 */
export function validateStaticExportOptions(options: StaticExportOptions): string | undefined {
  if (!options.enabled) {
    return undefined;
  }

  const needsSiteUrl = options.llmsTxt !== false || options.llmsFullTxt !== false;

  if (needsSiteUrl && !options.siteUrl) {
    return '[@docfy/ember-vite] staticExport.siteUrl is required when llmsTxt or llmsFullTxt is enabled.';
  }

  return undefined;
}

function requireSiteUrl(options: StaticExportOptions): string {
  if (!options.siteUrl) {
    throw new Error(
      '[@docfy/ember-vite] staticExport.siteUrl is required when llmsTxt or llmsFullTxt is enabled.'
    );
  }

  return options.siteUrl;
}

/**
 * Flatten the nested page metadata into an ordered list of sections.
 *
 * `nestedPageMetadata` already encodes the section labels and the resolved
 * order from the `sections` config, so both llms.txt and llms-full.txt derive
 * their ordering from here rather than sorting independently.
 */
export function flattenSections(nested: NestedPageMetadata, depth = 0): FlatSection[] {
  const sections: FlatSection[] = [];

  if (nested.pages.length > 0) {
    sections.push({ label: nested.label, pages: nested.pages, depth });
  }

  nested.children.forEach(child => {
    sections.push(...flattenSections(child, depth + 1));
  });

  return sections;
}

/**
 * Build the absolute URL of a page's Markdown mirror. Derived from
 * `markdownFileName` so the link can never diverge from the emitted file path.
 */
export function pageMarkdownUrl(siteUrl: string, url: string): string {
  return `${siteUrl.replace(/\/+$/, '')}/${markdownFileName(url)}`;
}

/**
 * Build the `llms.txt` index: an H1 project name (if provided), an optional
 * blockquote summary, then every page as an absolute `.md` link grouped by
 * section, following the llms.txt convention (https://llmstxt.org).
 */
export function buildLlmsTxt(nested: NestedPageMetadata, options: StaticExportOptions): string {
  const siteUrl = requireSiteUrl(options);
  const lines: string[] = [];

  if (options.projectName) {
    lines.push(`# ${options.projectName}`, '');
  }

  if (options.projectDescription) {
    lines.push(`> ${options.projectDescription}`, '');
  }

  flattenSections(nested).forEach(section => {
    // The root node's label is '/', which is not a meaningful heading.
    if (section.depth > 0) {
      lines.push(`## ${section.label}`, '');
    }

    section.pages.forEach(page => {
      lines.push(`- [${page.title}](${pageMarkdownUrl(siteUrl, page.url)})`);
    });

    lines.push('');
  });

  return `${lines.join('\n').trimEnd()}\n`;
}

/**
 * Build `llms-full.txt`: every page's exported Markdown concatenated in
 * section order, each preceded by its title and a `Source:` link back to the
 * page's `.md` mirror.
 */
export function buildLlmsFullTxt(
  nested: NestedPageMetadata,
  pagesByUrl: Map<string, PageContent>,
  options: StaticExportOptions
): string {
  const siteUrl = requireSiteUrl(options);
  const blocks: string[] = [];

  flattenSections(nested).forEach(section => {
    section.pages.forEach(meta => {
      const page = pagesByUrl.get(meta.url);

      if (!page) {
        return;
      }

      blocks.push(
        [
          `# ${meta.title}`,
          '',
          `Source: ${pageMarkdownUrl(siteUrl, meta.url)}`,
          '',
          pageMarkdown(page),
        ].join('\n')
      );
    });
  });

  return `${blocks.join('\n\n---\n\n')}\n`;
}

/**
 * Turn a Docfy result into the complete set of static text files to emit.
 * Pure: performs no IO, so the caller decides how each file is written.
 */
export function collectStaticExportFiles(
  result: DocfyResult,
  options: StaticExportOptions
): FileToGenerate[] {
  const files: FileToGenerate[] = [];

  if (options.markdown !== false) {
    result.content.forEach(page => {
      files.push({
        path: markdownFileName(page.meta.url),
        content: `${pageMarkdown(page)}\n`,
      });
    });
  }

  if (options.llmsTxt !== false) {
    files.push({
      path: 'llms.txt',
      content: buildLlmsTxt(result.nestedPageMetadata, options),
    });
  }

  if (options.llmsFullTxt !== false) {
    const pagesByUrl = new Map(result.content.map(page => [page.meta.url, page]));

    files.push({
      path: 'llms-full.txt',
      content: buildLlmsFullTxt(result.nestedPageMetadata, pagesByUrl, options),
    });
  }

  debug('Collected static export files', { count: files.length });

  return files;
}
