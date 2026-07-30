import type { PageContent } from '@docfy/core/lib/types';

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
