import { describe, it, expect } from 'vitest';
import type { ResolvedConfig } from 'vite';
import type { DocfyResult } from '@docfy/core/lib/types';
import { DocfyProcessor } from '../src/docfy-processor.js';
import { FileManager } from '../src/file-manager.js';

interface Written {
  fileName: string;
  content: string;
}

/**
 * A FileManager stand-in that records writes instead of touching disk or rollup.
 */
class RecordingFileManager extends FileManager {
  written: Written[] = [];

  constructor(command: 'build' | 'serve') {
    super({ command } as ResolvedConfig, undefined);
  }

  override writeTextToPublic(content: string, fileName: string): void {
    this.written.push({ fileName, content });
  }

  override writeJsonToPublic(): void {
    // ignored — not under test here
  }
}

function makeResult(): DocfyResult {
  return {
    content: [
      {
        meta: {
          url: '/docs/about',
          relativeUrl: undefined,
          relativePath: 'about.md',
          editUrl: '',
          title: 'About',
          headings: [],
          frontmatter: {},
          pluginData: {},
          parentLabel: undefined,
        },
        sourceConfig: { root: '/root', pattern: '**/*.md' },
        source: 'about.md',
        vFile: {} as never,
        ast: { type: 'root' },
        markdown: '# About\n',
        rendered: '',
        pluginData: {},
      },
    ],
    staticAssets: [],
    nestedPageMetadata: {
      name: '/',
      label: '/',
      pages: [],
      children: [
        {
          name: 'docs',
          label: 'Documentation',
          pages: [
            {
              url: '/docs/about',
              relativeUrl: 'about',
              relativePath: 'about.md',
              editUrl: '',
              title: 'About',
              headings: [],
              frontmatter: {},
              pluginData: {},
              parentLabel: '/',
            },
          ],
          children: [],
        },
      ],
    },
  } as DocfyResult;
}

function runExport(
  command: 'build' | 'serve',
  staticExport: Record<string, unknown> | undefined
): Written[] {
  const fileManager = new RecordingFileManager(command);
  const processor = new DocfyProcessor(
    { command } as ResolvedConfig,
    { sources: [] },
    fileManager,
    staticExport as never
  );

  // handleStaticExport is private; exercise it the way processAll does.
  (processor as never as { handleStaticExport(r: DocfyResult): void }).handleStaticExport(
    makeResult()
  );

  return fileManager.written;
}

describe('DocfyProcessor static export', () => {
  it('emits markdown and llms files during a build when enabled', () => {
    const written = runExport('build', { enabled: true, siteUrl: 'https://docfy.dev' });

    expect(written.map(w => w.fileName)).toEqual(['docs/about.md', 'llms.txt', 'llms-full.txt']);
    expect(written[0].content).toBe('# About\n');
  });

  it('emits nothing when the option is absent', () => {
    expect(runExport('build', undefined)).toEqual([]);
  });

  it('emits nothing when enabled is false', () => {
    expect(runExport('build', { enabled: false, siteUrl: 'https://docfy.dev' })).toEqual([]);
  });

  it('emits nothing in dev mode even when enabled', () => {
    expect(runExport('serve', { enabled: true, siteUrl: 'https://docfy.dev' })).toEqual([]);
  });
});
