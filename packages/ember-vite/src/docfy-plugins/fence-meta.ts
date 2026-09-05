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

export function parseFenceMeta(meta?: string | null): CodeBlockOptions {
  const value = meta ?? '';
  const titleMatch = TITLE_PATTERN.exec(value);
  const title = titleMatch ? (titleMatch[1] ?? titleMatch[2]) : undefined;

  // Strip the title before splitting on whitespace, so a title containing
  // spaces cannot be mistaken for flag tokens.
  const flags = value.replace(TITLE_PATTERN, ' ').split(/\s+/).filter(Boolean);

  return {
    title,
    showLineNumbers: flags.includes('showLineNumbers'),
    collapsible: flags.includes('collapsible'),
    copyable: !flags.includes('noCopy'),
  };
}
