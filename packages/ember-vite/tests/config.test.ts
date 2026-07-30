import { describe, it, expect } from 'vitest';
import { loadDocfyConfig, resolveStaticExportOptions } from '../src/config.js';

describe('loadDocfyConfig', () => {
  it('does not leak staticExport into the Docfy core config', async () => {
    const config = await loadDocfyConfig(process.cwd(), {
      root: process.cwd(),
      config: { sources: [{ pattern: '**/*.md', urlPrefix: 'docs' }] },
      staticExport: { enabled: true, siteUrl: 'https://docfy.dev' },
    });

    expect('staticExport' in config).toBe(false);
  });

  it('still applies the inline sources config', async () => {
    const config = await loadDocfyConfig(process.cwd(), {
      root: process.cwd(),
      config: { sources: [{ pattern: '**/*.md', urlPrefix: 'guides' }] },
    });

    expect(config.sources?.[0]?.urlPrefix).toBe('guides');
  });
});

describe('resolveStaticExportOptions', () => {
  // These run with cwd = packages/ember-vite, whose package.json name is
  // '@docfy/ember-vite'.
  const root = process.cwd();

  it('defaults projectName from the app package.json name', async () => {
    const resolved = await resolveStaticExportOptions(root, { enabled: true });

    expect(resolved?.projectName).toBe('@docfy/ember-vite');
  });

  it('leaves an explicit projectName alone', async () => {
    const resolved = await resolveStaticExportOptions(root, {
      enabled: true,
      projectName: 'Docfy',
    });

    expect(resolved?.projectName).toBe('Docfy');
  });

  it('preserves the other options when defaulting', async () => {
    const resolved = await resolveStaticExportOptions(root, {
      enabled: true,
      siteUrl: 'https://docfy.dev',
      llmsFullTxt: false,
    });

    expect(resolved).toEqual({
      enabled: true,
      siteUrl: 'https://docfy.dev',
      llmsFullTxt: false,
      projectName: '@docfy/ember-vite',
    });
  });

  it('does nothing when the export is not enabled', async () => {
    const input = { enabled: false };

    expect(await resolveStaticExportOptions(root, input)).toEqual({ enabled: false });
  });

  it('returns undefined when no staticExport was configured', async () => {
    expect(await resolveStaticExportOptions(root, undefined)).toBeUndefined();
  });

  it('leaves projectName unset when the package.json cannot be read', async () => {
    const resolved = await resolveStaticExportOptions('/nonexistent-path-xyz', {
      enabled: true,
    });

    expect(resolved?.projectName).toBeUndefined();
  });
});
