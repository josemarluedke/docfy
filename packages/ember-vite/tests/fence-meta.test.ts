import { describe, expect, test } from 'vitest';
import { parseFenceMeta } from '../src/docfy-plugins/fence-meta.js';

describe('parseFenceMeta', () => {
  test('returns defaults for empty meta', () => {
    expect(parseFenceMeta()).toEqual({
      title: undefined,
      showLineNumbers: false,
      collapsible: false,
      copyable: true,
    });
    expect(parseFenceMeta('')).toEqual(parseFenceMeta());
    expect(parseFenceMeta(null)).toEqual(parseFenceMeta());
  });

  test('parses a double-quoted title', () => {
    expect(parseFenceMeta('title="components/ui/tabs.gts"').title).toBe(
      'components/ui/tabs.gts',
    );
  });

  test('parses a single-quoted title', () => {
    expect(parseFenceMeta("title='app.gts'").title).toBe('app.gts');
  });

  test('parses a title containing spaces', () => {
    expect(parseFenceMeta('title="my file.gts" collapsible').title).toBe('my file.gts');
  });

  test('parses boolean flags', () => {
    const result = parseFenceMeta('showLineNumbers collapsible noCopy');
    expect(result.showLineNumbers).toBe(true);
    expect(result.collapsible).toBe(true);
    expect(result.copyable).toBe(false);
  });

  test('ignores Shiki line-range tokens', () => {
    const result = parseFenceMeta('{4,9-12} title="a.ts"');
    expect(result.title).toBe('a.ts');
    expect(result.collapsible).toBe(false);
  });

  test('ignores unknown tokens rather than throwing', () => {
    expect(() => parseFenceMeta('twoslash somethingElse=1')).not.toThrow();
    expect(parseFenceMeta('twoslash').copyable).toBe(true);
  });
});
