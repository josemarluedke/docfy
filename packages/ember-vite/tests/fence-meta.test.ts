import { describe, expect, test } from 'vitest';
import { findFenceMarker, parseFenceMeta } from '../src/docfy-plugins/fence-meta.js';

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
    expect(parseFenceMeta('title="components/ui/tabs.gts"').title).toBe('components/ui/tabs.gts');
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

describe('findFenceMarker', () => {
  const markers = ['preview-template', 'preview'] as const;

  test('finds a marker that is the whole meta string', () => {
    expect(findFenceMarker('preview', markers)).toBe('preview');
    expect(findFenceMarker('preview-template', markers)).toBe('preview-template');
  });

  test('finds a marker sharing the meta string with other options', () => {
    expect(findFenceMarker('preview collapsible showLineNumbers', markers)).toBe('preview');
    expect(findFenceMarker('collapsible preview-template', markers)).toBe('preview-template');
    expect(findFenceMarker('preview title="a b.gts"', markers)).toBe('preview');
  });

  test('returns undefined when no marker is present', () => {
    expect(findFenceMarker('collapsible', markers)).toBeUndefined();
    expect(findFenceMarker('', markers)).toBeUndefined();
    expect(findFenceMarker(undefined, markers)).toBeUndefined();
    expect(findFenceMarker(null, markers)).toBeUndefined();
  });

  test('does not match a marker appearing inside a title', () => {
    expect(findFenceMarker('title="a preview of things"', markers)).toBeUndefined();
  });

  test('does not match a marker that is only part of another token', () => {
    expect(findFenceMarker('previewish', markers)).toBeUndefined();
  });
});
