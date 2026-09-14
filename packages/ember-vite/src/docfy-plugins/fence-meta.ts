/**
 * Options a docs author can set on a fence's meta string.
 *
 * Only the tokens Shiki ignores are handled here. Line ranges (`{4,9-12}`) and
 * word highlighting are parsed by Shiki's own transformers, so this parser
 * deliberately skips them rather than reimplementing range syntax.
 */
export interface CodeBlockOptions {
  title?: string;
  showLineNumbers: boolean;
  collapsible: boolean;
  copyable: boolean;
}

// Matches `title="a b.gts"` or `title='a b.gts'`, capturing the quoted value.
const TITLE_PATTERN = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/;

/**
 * Splits a meta string into its whitespace-separated tokens.
 *
 * The title is stripped first, so a title containing spaces cannot be mistaken
 * for tokens.
 */
function metaTokens(meta?: string | null): string[] {
  return (meta ?? '').replace(TITLE_PATTERN, ' ').split(/\s+/).filter(Boolean);
}

/**
 * Returns the first of `markers` present as a standalone token in the meta
 * string, or `undefined` when none is.
 *
 * Demo markers (`preview`, `component`, ...) share the meta string with the
 * code-block options above, so they must be matched per token. Comparing
 * against the whole meta string instead — as this used to — silently dropped
 * the marker the moment an author combined it with any other option, e.g.
 * ```gjs preview collapsible```.
 */
export function findFenceMarker<T extends string>(
  meta: string | null | undefined,
  markers: readonly T[]
): T | undefined {
  const tokens = metaTokens(meta);

  return markers.find(marker => tokens.includes(marker));
}

export function parseFenceMeta(meta?: string | null): CodeBlockOptions {
  const value = meta ?? '';
  const titleMatch = TITLE_PATTERN.exec(value);
  const title = titleMatch ? (titleMatch[1] ?? titleMatch[2]) : undefined;
  const flags = metaTokens(value);

  return {
    title,
    showLineNumbers: flags.includes('showLineNumbers'),
    collapsible: flags.includes('collapsible'),
    copyable: !flags.includes('noCopy'),
  };
}
