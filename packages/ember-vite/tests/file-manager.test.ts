import { describe, it, expect } from 'vitest';
import type { PluginContext } from 'rollup';
import type { ResolvedConfig } from 'vite';
import { FileManager } from '../src/file-manager.js';

interface EmittedFile {
  type: string;
  fileName: string;
  source: string;
}

function buildManager(): { manager: FileManager; emitted: EmittedFile[] } {
  const emitted: EmittedFile[] = [];
  const context = {
    emitFile: (file: EmittedFile) => {
      emitted.push(file);
      return 'ref';
    },
  } as unknown as PluginContext;

  const config = { command: 'build' } as ResolvedConfig;

  return { manager: new FileManager(config, context), emitted };
}

describe('FileManager.writeTextToPublic', () => {
  it('emits arbitrary text as a rollup asset in build mode', () => {
    const { manager, emitted } = buildManager();

    manager.writeTextToPublic('hello\n', 'llms.txt');

    expect(emitted).toEqual([{ type: 'asset', fileName: 'llms.txt', source: 'hello\n' }]);
  });

  it('preserves nested file names verbatim so rollup does not hash them', () => {
    const { manager, emitted } = buildManager();

    manager.writeTextToPublic('# About\n', 'docs/about.md');

    expect(emitted[0].fileName).toBe('docs/about.md');
  });
});

describe('FileManager.writeJsonToPublic', () => {
  it('still serializes JSON to the default file name', () => {
    const { manager, emitted } = buildManager();

    manager.writeJsonToPublic(['/docs/a', '/docs/b']);

    expect(emitted).toEqual([
      {
        type: 'asset',
        fileName: 'docfy-urls.json',
        source: '["/docs/a","/docs/b"]',
      },
    ]);
  });
});
