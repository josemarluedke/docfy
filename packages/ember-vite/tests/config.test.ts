import { describe, it, expect } from 'vitest';
import { loadDocfyConfig } from '../src/config.js';

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
