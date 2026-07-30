import { describe, it, expect } from 'vitest';
import type {
  DocfyResult,
  NestedPageMetadata,
  PageContent,
  PageMetadata,
} from '@docfy/core/lib/types';
import {
  stripFrontmatter,
  markdownFileName,
  pageMarkdown,
  flattenSections,
  pageMarkdownUrl,
  buildLlmsTxt,
  buildLlmsFullTxt,
  collectStaticExportFiles,
  validateStaticExportOptions,
} from '../src/static-export.js';

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

function makeMeta(url: string, title: string): PageMetadata {
  return {
    url,
    relativeUrl: undefined,
    relativePath: `${title}.md`,
    editUrl: '',
    title,
    headings: [],
    frontmatter: {},
    pluginData: {},
    parentLabel: undefined,
  };
}

/**
 * Mirrors the shape @docfy/core produces: a root node named '/' whose children
 * are the sections. Section order here is already-resolved order.
 */
function makeNested(): NestedPageMetadata {
  return {
    name: '/',
    label: '/',
    pages: [makeMeta('/', 'Home')],
    children: [
      {
        name: 'docs',
        label: 'Documentation',
        pages: [makeMeta('/docs/', 'Introduction'), makeMeta('/docs/about', 'About')],
        children: [
          {
            name: 'ember',
            label: 'Ember',
            pages: [makeMeta('/docs/ember/setup', 'Setup')],
            children: [],
          },
        ],
      },
    ],
  };
}

describe('flattenSections', () => {
  it('walks the tree depth-first and records depth', () => {
    expect(flattenSections(makeNested())).toEqual([
      { label: '/', depth: 0, pages: [makeMeta('/', 'Home')] },
      {
        label: 'Documentation',
        depth: 1,
        pages: [makeMeta('/docs/', 'Introduction'), makeMeta('/docs/about', 'About')],
      },
      { label: 'Ember', depth: 2, pages: [makeMeta('/docs/ember/setup', 'Setup')] },
    ]);
  });

  it('skips sections that have no pages of their own', () => {
    const nested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [],
      children: [
        { name: 'docs', label: 'Documentation', pages: [makeMeta('/docs/a', 'A')], children: [] },
      ],
    };

    expect(flattenSections(nested).map(s => s.label)).toEqual(['Documentation']);
  });
});

describe('pageMarkdownUrl', () => {
  it('joins the site url with the markdown file name', () => {
    expect(pageMarkdownUrl('https://docfy.dev', '/docs/about')).toBe(
      'https://docfy.dev/docs/about.md'
    );
  });

  it('tolerates a trailing slash on the site url', () => {
    expect(pageMarkdownUrl('https://docfy.dev/', '/docs/about')).toBe(
      'https://docfy.dev/docs/about.md'
    );
  });

  it('uses index.md for index pages so the link matches the emitted file', () => {
    expect(pageMarkdownUrl('https://docfy.dev', '/docs/')).toBe('https://docfy.dev/docs/index.md');
  });
});

describe('buildLlmsTxt', () => {
  const opts = { enabled: true, siteUrl: 'https://docfy.dev' };

  it('lists every page as an absolute .md link grouped by section', () => {
    expect(buildLlmsTxt(makeNested(), opts)).toBe(
      [
        '- [Home](https://docfy.dev/index.md)',
        '',
        '## Documentation',
        '',
        '- [Introduction](https://docfy.dev/docs/index.md)',
        '- [About](https://docfy.dev/docs/about.md)',
        '',
        '## Ember',
        '',
        '- [Setup](https://docfy.dev/docs/ember/setup.md)',
        '',
      ].join('\n')
    );
  });

  it('includes the project description as a blockquote blurb', () => {
    const output = buildLlmsTxt(makeNested(), { ...opts, projectDescription: 'Docs builder.' });
    expect(output.startsWith('> Docs builder.\n\n')).toBe(true);
  });

  it('throws a clear error when siteUrl is missing', () => {
    expect(() => buildLlmsTxt(makeNested(), { enabled: true })).toThrow(/siteUrl is required/);
  });

  it('emits the project name as an H1 when provided', () => {
    const output = buildLlmsTxt(makeNested(), { ...opts, projectName: 'Docfy' });
    expect(output.startsWith('# Docfy\n\n')).toBe(true);
  });

  it('emits project name then description in the correct order', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      projectName: 'Docfy',
      projectDescription: 'Docs builder.',
    });

    expect(output.startsWith('# Docfy\n\n> Docs builder.\n\n')).toBe(true);
  });

  it('omits the H1 when no project name is provided', () => {
    const output = buildLlmsTxt(makeNested(), opts);
    expect(output.startsWith('#')).toBe(false);
  });
});

describe('buildLlmsFullTxt', () => {
  const opts = { enabled: true, siteUrl: 'https://docfy.dev' };

  function pagesByUrl(): Map<string, PageContent> {
    return new Map([
      ['/', makePage({ meta: makeMeta('/', 'Home'), markdown: '# Home\n' })],
      ['/docs/', makePage({ meta: makeMeta('/docs/', 'Introduction'), markdown: '# Intro\n' })],
      ['/docs/about', makePage({ meta: makeMeta('/docs/about', 'About'), markdown: '# About\n' })],
      [
        '/docs/ember/setup',
        makePage({ meta: makeMeta('/docs/ember/setup', 'Setup'), markdown: '# Setup\n' }),
      ],
    ]);
  }

  it('concatenates every page in section order with rule separators', () => {
    expect(buildLlmsFullTxt(makeNested(), pagesByUrl(), opts)).toBe(
      [
        '# Home',
        '',
        'Source: https://docfy.dev/index.md',
        '',
        '# Home',
        '',
        '---',
        '',
        '# Introduction',
        '',
        'Source: https://docfy.dev/docs/index.md',
        '',
        '# Intro',
        '',
        '---',
        '',
        '# About',
        '',
        'Source: https://docfy.dev/docs/about.md',
        '',
        '# About',
        '',
        '---',
        '',
        '# Setup',
        '',
        'Source: https://docfy.dev/docs/ember/setup.md',
        '',
        '# Setup',
        '',
      ].join('\n')
    );
  });

  it('skips metadata entries with no matching content', () => {
    const output = buildLlmsFullTxt(makeNested(), new Map(), opts);
    expect(output).toBe('\n');
  });

  it('throws a clear error when siteUrl is missing', () => {
    expect(() => buildLlmsFullTxt(makeNested(), pagesByUrl(), { enabled: true })).toThrow(
      /siteUrl is required/
    );
  });
});

describe('collectStaticExportFiles', () => {
  const opts = { enabled: true, siteUrl: 'https://docfy.dev' };

  function makeResult(): DocfyResult {
    const home = makePage({ meta: makeMeta('/', 'Home'), markdown: '# Home\n' });
    const intro = makePage({ meta: makeMeta('/docs/', 'Introduction'), markdown: '# Intro\n' });
    const about = makePage({ meta: makeMeta('/docs/about', 'About'), markdown: '# About\n' });
    const setup = makePage({
      meta: makeMeta('/docs/ember/setup', 'Setup'),
      markdown: '# Setup\n',
    });

    return {
      content: [home, intro, about, setup],
      staticAssets: [],
      nestedPageMetadata: makeNested(),
    };
  }

  it('emits one markdown file per page plus both llms files', () => {
    const files = collectStaticExportFiles(makeResult(), opts);

    expect(files.map(f => f.path)).toEqual([
      'index.md',
      'docs/index.md',
      'docs/about.md',
      'docs/ember/setup.md',
      'llms.txt',
      'llms-full.txt',
    ]);
  });

  it('ends every markdown file with a single trailing newline', () => {
    const files = collectStaticExportFiles(makeResult(), opts);
    const about = files.find(f => f.path === 'docs/about.md');

    expect(about?.content).toBe('# About\n');
  });

  it('honours the markdown toggle', () => {
    const files = collectStaticExportFiles(makeResult(), { ...opts, markdown: false });

    expect(files.map(f => f.path)).toEqual(['llms.txt', 'llms-full.txt']);
  });

  it('honours the llmsTxt and llmsFullTxt toggles', () => {
    const files = collectStaticExportFiles(makeResult(), {
      ...opts,
      llmsTxt: false,
      llmsFullTxt: false,
    });

    expect(files.map(f => f.path)).toEqual([
      'index.md',
      'docs/index.md',
      'docs/about.md',
      'docs/ember/setup.md',
    ]);
  });

  it('does not require siteUrl when only markdown is emitted', () => {
    const files = collectStaticExportFiles(makeResult(), {
      enabled: true,
      llmsTxt: false,
      llmsFullTxt: false,
    });

    expect(files).toHaveLength(4);
  });

  it('throws when an llms file is requested without siteUrl', () => {
    expect(() => collectStaticExportFiles(makeResult(), { enabled: true })).toThrow(
      /siteUrl is required/
    );
  });
});

describe('validateStaticExportOptions', () => {
  it('returns an error when enabled with no siteUrl and llms files on', () => {
    expect(validateStaticExportOptions({ enabled: true })).toMatch(/siteUrl is required/);
  });

  it('returns undefined when enabled with a siteUrl', () => {
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'https://docfy.dev' })
    ).toBeUndefined();
  });

  it('returns undefined when both llms toggles are off and no siteUrl is set', () => {
    expect(
      validateStaticExportOptions({ enabled: true, llmsTxt: false, llmsFullTxt: false })
    ).toBeUndefined();
  });

  it('returns undefined when not enabled at all', () => {
    expect(validateStaticExportOptions({})).toBeUndefined();
    expect(validateStaticExportOptions({ enabled: false })).toBeUndefined();
  });
});
