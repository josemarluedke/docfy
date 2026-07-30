import { describe, it, expect } from 'vitest';
import type { PageContent } from '@docfy/core/lib/types';
import { stripFrontmatter, markdownFileName, pageMarkdown } from '../src/static-export.js';

function makePage(overrides: Partial<PageContent> = {}): PageContent {
  return {
    meta: {
      url: '/docs/button',
      relativeUrl: undefined,
      relativePath: 'button.md',
      editUrl: '',
      title: 'Button',
      headings: [],
      frontmatter: {},
      pluginData: {},
      parentLabel: undefined,
    },
    sourceConfig: { root: '/root', pattern: '**/*.md' },
    source: 'button.md',
    vFile: {} as never,
    ast: { type: 'root' },
    markdown: '# Button\n',
    rendered: '',
    pluginData: {},
    ...overrides,
  } as PageContent;
}

describe('stripFrontmatter', () => {
  it('removes a leading frontmatter block', () => {
    const input = '---\ntitle: Button\n---\n# Button\n';
    expect(stripFrontmatter(input)).toBe('# Button\n');
  });

  it('leaves content without frontmatter untouched', () => {
    expect(stripFrontmatter('# Button\n')).toBe('# Button\n');
  });

  it('does not touch a horizontal rule inside the body', () => {
    const input = '# Button\n\n---\n\nMore text\n';
    expect(stripFrontmatter(input)).toBe(input);
  });

  it('handles CRLF line endings', () => {
    const input = '---\r\ntitle: Button\r\n---\r\n# Button\r\n';
    expect(stripFrontmatter(input)).toBe('# Button\r\n');
  });
});

describe('markdownFileName', () => {
  it('appends .md and strips the leading slash', () => {
    expect(markdownFileName('/docs/about')).toBe('docs/about.md');
  });

  it('turns a trailing-slash index url into index.md', () => {
    expect(markdownFileName('/docs/')).toBe('docs/index.md');
  });

  it('handles nested paths', () => {
    expect(markdownFileName('/docs/components/buttons/button-group')).toBe(
      'docs/components/buttons/button-group.md'
    );
  });

  it('maps the site root to index.md', () => {
    expect(markdownFileName('/')).toBe('index.md');
  });
});

describe('pageMarkdown', () => {
  it('falls back to the raw page markdown with frontmatter stripped', () => {
    const page = makePage({ markdown: '---\ntitle: Button\n---\n# Button\n\nBody\n' });
    expect(pageMarkdown(page)).toBe('# Button\n\nBody');
  });

  it('prefers a pluginData.staticMarkdown override', () => {
    const page = makePage({
      markdown: '# Raw\n',
      pluginData: { staticMarkdown: '# Transformed\n\n| Name | Type |\n| --- | --- |\n' },
    });
    expect(pageMarkdown(page)).toBe('# Transformed\n\n| Name | Type |\n| --- | --- |');
  });

  it('strips frontmatter from an override too', () => {
    const page = makePage({ pluginData: { staticMarkdown: '---\na: 1\n---\n# Over\n' } });
    expect(pageMarkdown(page)).toBe('# Over');
  });

  it('ignores a non-string override', () => {
    const page = makePage({ markdown: '# Raw\n', pluginData: { staticMarkdown: 42 } });
    expect(pageMarkdown(page)).toBe('# Raw');
  });
});
