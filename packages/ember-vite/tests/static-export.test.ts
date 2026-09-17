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
  buildLlmsSplitTxt,
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

  it('returns a root-relative link when siteUrl is undefined', () => {
    expect(pageMarkdownUrl(undefined, '/docs/about')).toBe('/docs/about.md');
  });

  it('returns a root-relative index link for a trailing-slash url', () => {
    expect(pageMarkdownUrl(undefined, '/docs/')).toBe('/docs/index.md');
  });

  it('returns the root-relative index link for the site root', () => {
    expect(pageMarkdownUrl(undefined, '/')).toBe('/index.md');
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

  it('emits root-relative links when siteUrl is not provided', () => {
    expect(buildLlmsTxt(makeNested(), { enabled: true })).toBe(
      [
        '- [Home](/index.md)',
        '',
        '## Documentation',
        '',
        '- [Introduction](/docs/index.md)',
        '- [About](/docs/about.md)',
        '',
        '## Ember',
        '',
        '- [Setup](/docs/ember/setup.md)',
        '',
      ].join('\n')
    );
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

  it('appends the frontmatter description to a page entry', () => {
    const nested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [
        {
          ...makeMeta('/', 'Home'),
          frontmatter: { description: 'A clickable button.' },
        },
      ],
      children: [],
    };

    expect(buildLlmsTxt(nested, opts)).toBe(
      '- [Home](https://docfy.dev/index.md): A clickable button.\n'
    );
  });

  it('emits the bare link when the description is absent, blank, or not a string', () => {
    const cases = [undefined, '', '   ', 42];

    cases.forEach(description => {
      const nested: NestedPageMetadata = {
        name: '/',
        label: '/',
        pages: [{ ...makeMeta('/', 'Home'), frontmatter: { description } }],
        children: [],
      };

      expect(buildLlmsTxt(nested, opts)).toBe('- [Home](https://docfy.dev/index.md)\n');
    });
  });

  it('renders projectPreamble after the description and before the first section', () => {
    // Use a nested tree with no pages at the root, so the preamble's position
    // relative to the first `## section` heading is unambiguous.
    const nested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [],
      children: [
        {
          name: 'docs',
          label: 'Documentation',
          pages: [makeMeta('/docs/about', 'About')],
          children: [],
        },
      ],
    };

    const output = buildLlmsTxt(nested, {
      ...opts,
      projectDescription: 'Docs builder.',
      projectPreamble: 'This index lists every page in the docs site.',
    });

    expect(
      output.startsWith(
        '> Docs builder.\n\nThis index lists every page in the docs site.\n\n## Documentation'
      )
    ).toBe(true);
  });

  it('omits projectPreamble entirely when absent or whitespace-only', () => {
    const nested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [],
      children: [
        {
          name: 'docs',
          label: 'Documentation',
          pages: [makeMeta('/docs/about', 'About')],
          children: [],
        },
      ],
    };

    const withDescriptionOnly = buildLlmsTxt(nested, {
      ...opts,
      projectDescription: 'Docs builder.',
    });
    expect(withDescriptionOnly.startsWith('> Docs builder.\n\n## Documentation')).toBe(true);

    const withBlankPreamble = buildLlmsTxt(nested, {
      ...opts,
      projectDescription: 'Docs builder.',
      projectPreamble: '   ',
    });
    expect(withBlankPreamble.startsWith('> Docs builder.\n\n## Documentation')).toBe(true);
  });

  it('emits a sectionNotes entry as an italic line under its heading', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      sectionNotes: { Documentation: 'Deprecated. Use the current docs instead.' },
    });

    expect(output).toContain(
      '## Documentation\n\n_Deprecated. Use the current docs instead._\n\n- [Introduction]'
    );
  });

  it('leaves sections with no matching note unchanged', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      sectionNotes: { Documentation: 'A note.' },
    });

    expect(output).toContain('## Ember\n\n- [Setup]');
  });

  it('never applies a note to the unlabeled root section (depth 0)', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      sectionNotes: { '/': 'Should never appear.' },
    });

    expect(output).not.toContain('Should never appear.');
  });

  it('trims the description and collapses internal newlines to single spaces', () => {
    const nested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [
        {
          ...makeMeta('/', 'Home'),
          frontmatter: { description: '  Line one\nLine two  \n  Line three  ' },
        },
      ],
      children: [],
    };

    expect(buildLlmsTxt(nested, opts)).toBe(
      '- [Home](https://docfy.dev/index.md): Line one Line two Line three\n'
    );
  });

  it('appends a Bulk documentation section listing llmsSplits and llms-full.txt', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      llmsSplits: [{ name: 'components', sections: ['Documentation'] }],
    });

    expect(
      output.endsWith(
        [
          '## Bulk documentation',
          '',
          '- [llms-full.txt](https://docfy.dev/llms-full.txt): Every page, concatenated.',
          '- [llms-components.txt](https://docfy.dev/llms-components.txt)',
          '',
        ].join('\n')
      )
    ).toBe(true);
  });

  it('omits llms-full.txt from Bulk documentation when llmsFullTxt is false', () => {
    const output = buildLlmsTxt(makeNested(), {
      ...opts,
      llmsFullTxt: false,
      llmsSplits: [{ name: 'components', sections: ['Documentation'] }],
    });

    expect(
      output.endsWith(
        [
          '## Bulk documentation',
          '',
          '- [llms-components.txt](https://docfy.dev/llms-components.txt)',
          '',
        ].join('\n')
      )
    ).toBe(true);
    expect(output).not.toContain('llms-full.txt');
  });

  it('omits the Bulk documentation section entirely when llmsSplits is empty or absent', () => {
    expect(buildLlmsTxt(makeNested(), opts)).not.toContain('Bulk documentation');
    expect(buildLlmsTxt(makeNested(), { ...opts, llmsSplits: [] })).not.toContain(
      'Bulk documentation'
    );
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

  it('emits root-relative Source links when siteUrl is not provided', () => {
    const output = buildLlmsFullTxt(makeNested(), pagesByUrl(), { enabled: true });

    expect(output).toBe(
      [
        '# Home',
        '',
        'Source: /index.md',
        '',
        '# Home',
        '',
        '---',
        '',
        '# Introduction',
        '',
        'Source: /docs/index.md',
        '',
        '# Intro',
        '',
        '---',
        '',
        '# About',
        '',
        'Source: /docs/about.md',
        '',
        '# About',
        '',
        '---',
        '',
        '# Setup',
        '',
        'Source: /docs/ember/setup.md',
        '',
        '# Setup',
        '',
      ].join('\n')
    );
  });
});

describe('buildLlmsSplitTxt', () => {
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

  it('includes only pages whose section label matches the filter', () => {
    const output = buildLlmsSplitTxt(makeNested(), pagesByUrl(), opts, ['Ember']);

    expect(output).toBe(
      ['# Setup', '', 'Source: https://docfy.dev/docs/ember/setup.md', '', '# Setup', ''].join('\n')
    );
  });

  it('matches the same per-page format buildLlmsFullTxt produces, for multiple sections', () => {
    const output = buildLlmsSplitTxt(makeNested(), pagesByUrl(), opts, ['Documentation', 'Ember']);

    expect(output).toBe(
      [
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

  it('produces an empty-but-valid file when the section label does not exist', () => {
    const output = buildLlmsSplitTxt(makeNested(), pagesByUrl(), opts, ['Nonexistent']);
    expect(output).toBe('\n');
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

  it('returns all files with relative links when siteUrl is absent and llms files are enabled', () => {
    const files = collectStaticExportFiles(makeResult(), { enabled: true });

    expect(files.map(f => f.path)).toEqual([
      'index.md',
      'docs/index.md',
      'docs/about.md',
      'docs/ember/setup.md',
      'llms.txt',
      'llms-full.txt',
    ]);

    const llmsTxt = files.find(f => f.path === 'llms.txt');
    expect(llmsTxt?.content).toContain('](/docs/about.md)');

    const llmsFullTxt = files.find(f => f.path === 'llms-full.txt');
    expect(llmsFullTxt?.content).toContain('Source: /docs/about.md');
  });

  it('emits an llms-<name>.txt file per llmsSplits entry, filtered to its sections', () => {
    const files = collectStaticExportFiles(makeResult(), {
      ...opts,
      llmsSplits: [
        { name: 'components', sections: ['Documentation'] },
        { name: 'ember', sections: ['Ember'] },
      ],
    });

    expect(files.map(f => f.path)).toEqual([
      'index.md',
      'docs/index.md',
      'docs/about.md',
      'docs/ember/setup.md',
      'llms.txt',
      'llms-full.txt',
      'llms-components.txt',
      'llms-ember.txt',
    ]);

    const components = files.find(f => f.path === 'llms-components.txt');
    expect(components?.content).toContain('# Introduction');
    expect(components?.content).toContain('# About');
    expect(components?.content).not.toContain('# Setup');

    const ember = files.find(f => f.path === 'llms-ember.txt');
    expect(ember?.content).toBe(
      ['# Setup', '', 'Source: https://docfy.dev/docs/ember/setup.md', '', '# Setup', ''].join('\n')
    );
  });

  it('still emits llms-<name>.txt files when llmsFullTxt is disabled', () => {
    const files = collectStaticExportFiles(makeResult(), {
      ...opts,
      llmsFullTxt: false,
      llmsSplits: [{ name: 'ember', sections: ['Ember'] }],
    });

    expect(files.map(f => f.path)).toEqual([
      'index.md',
      'docs/index.md',
      'docs/about.md',
      'docs/ember/setup.md',
      'llms.txt',
      'llms-ember.txt',
    ]);
  });

  it('emits an empty-but-valid file for a split naming a nonexistent section', () => {
    const files = collectStaticExportFiles(makeResult(), {
      ...opts,
      llmsSplits: [{ name: 'ghost', sections: ['Nonexistent'] }],
    });

    const ghost = files.find(f => f.path === 'llms-ghost.txt');
    expect(ghost?.content).toBe('\n');
  });

  it('produces byte-identical output to today when no new options are used (regression)', () => {
    const files = collectStaticExportFiles(makeResult(), opts);

    expect(files).toEqual([
      { path: 'index.md', content: '# Home\n' },
      { path: 'docs/index.md', content: '# Intro\n' },
      { path: 'docs/about.md', content: '# About\n' },
      { path: 'docs/ember/setup.md', content: '# Setup\n' },
      {
        path: 'llms.txt',
        content: buildLlmsTxt(makeResult().nestedPageMetadata, opts),
      },
      {
        path: 'llms-full.txt',
        content: buildLlmsFullTxt(
          makeResult().nestedPageMetadata,
          new Map(makeResult().content.map(page => [page.meta.url, page])),
          opts
        ),
      },
    ]);
  });
});

describe('validateStaticExportOptions', () => {
  it('returns undefined when not enabled at all', () => {
    expect(validateStaticExportOptions({})).toBeUndefined();
    expect(validateStaticExportOptions({ enabled: false })).toBeUndefined();
  });

  it('returns undefined when enabled with no siteUrl', () => {
    expect(validateStaticExportOptions({ enabled: true })).toBeUndefined();
  });

  it('returns undefined for a valid https siteUrl', () => {
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'https://docfy.dev' })
    ).toBeUndefined();
  });

  it('returns undefined for a valid http siteUrl with a port', () => {
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'http://localhost:4200' })
    ).toBeUndefined();
  });

  it('returns an error when siteUrl has no scheme', () => {
    expect(validateStaticExportOptions({ enabled: true, siteUrl: 'docfy.dev' })).toMatch(
      /\[@docfy\/ember-vite\]/
    );
  });

  it('returns an error when siteUrl uses an unsupported protocol', () => {
    expect(validateStaticExportOptions({ enabled: true, siteUrl: 'ftp://x.com' })).toMatch(
      /\[@docfy\/ember-vite\]/
    );
  });

  it('returns an error when siteUrl carries a query string', () => {
    // Would otherwise produce "https://docfy.dev/foo?x=1/docs/about.md".
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'https://docfy.dev/foo?x=1' })
    ).toMatch(/must not include a query string or fragment/);
  });

  it('returns an error when siteUrl carries a fragment', () => {
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'https://docfy.dev#top' })
    ).toMatch(/must not include a query string or fragment/);
  });

  it('accepts a siteUrl served under a subpath', () => {
    // Docs hosted at a subpath concatenate correctly, so a path is allowed.
    expect(
      validateStaticExportOptions({ enabled: true, siteUrl: 'https://example.com/docs-site' })
    ).toBeUndefined();
  });
});

describe('pageMarkdownUrl with a subpath siteUrl', () => {
  it('concatenates cleanly under a subpath', () => {
    expect(pageMarkdownUrl('https://example.com/docs-site', '/docs/about')).toBe(
      'https://example.com/docs-site/docs/about.md'
    );
  });
});
