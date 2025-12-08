import Docfy from '../src';
import { DocfyResult } from '../src/types';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('Section ordering', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      sections: {
        category2: { label: 'Category 2', order: 1 },
        category1: { label: 'Category 1', order: 2 },
        // test-custom has no order, should be alphabetically sorted after ordered sections
      },
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);
  });

  test('sections should be ordered by order value first, then alphabetically', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const sectionNames = docs?.children.map((child) => child.name);

    // category2 (order: 1) should come first
    // category1 (order: 2) should come second
    // test-custom (no order) should come after, alphabetically
    expect(sectionNames).toEqual([
      'category2',
      'category1',
      'test-custom',
    ]);
  });

  test('sections should use custom labels from sections config', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const category1 = docs?.children.find((child) => child.name === 'category1');
    const category2 = docs?.children.find((child) => child.name === 'category2');

    expect(category1?.label).toBe('Category 1');
    expect(category2?.label).toBe('Category 2');
  });

  test('sections without config should use folder name as label', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const testCustom = docs?.children.find((child) => child.name === 'test-custom');

    expect(testCustom?.label).toBe('test-custom');
  });
});

describe('Backward compatibility with labels config', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      labels: {
        category1: 'Category One',
        category2: 'Category Two',
      },
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);
  });

  test('labels config should still work for custom labels', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const category1 = docs?.children.find((child) => child.name === 'category1');
    const category2 = docs?.children.find((child) => child.name === 'category2');

    expect(category1?.label).toBe('Category One');
    expect(category2?.label).toBe('Category Two');
  });

  test('sections should be alphabetically sorted when using labels config', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const sectionNames = docs?.children.map((child) => child.name);

    // All sections should be alphabetically sorted by label
    expect(sectionNames).toEqual([
      'category1', // "Category One"
      'category2', // "Category Two"
      'test-custom', // "test-custom"
    ]);
  });
});

describe('Sections config takes precedence over labels config', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      labels: {
        category1: 'Old Label',
      },
      sections: {
        category1: { label: 'New Label', order: 1 },
      },
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);
  });

  test('sections config should override labels config', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const category1 = docs?.children.find((child) => child.name === 'category1');

    expect(category1?.label).toBe('New Label');
  });
});

describe('Nested section ordering', () => {
  let result: DocfyResult;

  beforeAll(async () => {
    const docfy = new Docfy({
      sections: {
        category1: { label: 'Category 1', order: 1 },
        components: { label: 'UI Components', order: 1 },
      },
    });
    result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);
  });

  test('nested sections should use sections config for labels and ordering', () => {
    const docs = result.nestedPageMetadata.children.find((child) => child.name === 'docs');
    expect(docs).toBeDefined();

    const category1 = docs?.children.find((child) => child.name === 'category1');
    expect(category1).toBeDefined();

    // Check that the nested 'components' section uses the configured label
    const components = category1?.children.find((child) => child.name === 'components');
    expect(components?.label).toBe('UI Components');
  });
});
