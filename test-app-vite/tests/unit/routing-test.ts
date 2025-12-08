import { module, test } from 'qunit';
import { findNestedByScope, addDocfyScopedRoutes } from '@docfy/ember';
import type { NestedPageMetadata } from '@docfy/core/lib/types';

// Mock nested structure for testing
const mockNested: NestedPageMetadata = {
  name: '/',
  label: '/',
  pages: [],
  children: [
    {
      name: 'docs',
      label: 'Documentation',
      pages: [
        {
          url: '/docs',
          relativeUrl: '',
          relativePath: 'docs/index.md',
          editUrl: '',
          title: 'Docs Home',
          headings: [],
          frontmatter: {},
          pluginData: {},
          parentLabel: undefined,
        },
      ],
      children: [
        {
          name: 'category1',
          label: 'Category 1',
          pages: [
            {
              url: '/docs/category1/intro',
              relativeUrl: 'intro',
              relativePath: 'docs/category1/intro.md',
              editUrl: '',
              title: 'Intro',
              headings: [],
              frontmatter: {},
              pluginData: {},
              parentLabel: 'category1',
            },
          ],
          children: [
            {
              name: 'components',
              label: 'Components',
              pages: [
                {
                  url: '/docs/category1/components/button',
                  relativeUrl: 'button',
                  relativePath: 'docs/category1/components/button.md',
                  editUrl: '',
                  title: 'Button',
                  headings: [],
                  frontmatter: {},
                  pluginData: {},
                  parentLabel: 'components',
                },
              ],
              children: [],
            },
          ],
        },
        {
          name: 'category2',
          label: 'Category 2',
          pages: [
            {
              url: '/docs/category2/guide',
              relativeUrl: 'guide',
              relativePath: 'docs/category2/guide.md',
              editUrl: '',
              title: 'Guide',
              headings: [],
              frontmatter: {},
              pluginData: {},
              parentLabel: 'category2',
            },
          ],
          children: [],
        },
      ],
    },
  ],
};

// Mock RouterDSL for testing
interface RouteCall {
  name: string;
  hasCallback: boolean;
  isNested: boolean;
}

class MockRouterDSL {
  routes: RouteCall[] = [];

  route(name: string, callbackOrOptions?: any, maybeCallback?: any): void {
    const hasCallback =
      typeof callbackOrOptions === 'function' ||
      typeof maybeCallback === 'function';

    const callback =
      typeof callbackOrOptions === 'function'
        ? callbackOrOptions
        : maybeCallback;

    this.routes.push({
      name,
      hasCallback,
      isNested: hasCallback,
    });

    if (callback) {
      callback.call(this);
    }
  }

  getRouteNames(): string[] {
    return this.routes.map((r) => r.name);
  }

  reset(): void {
    this.routes = [];
  }
}

module('Unit | Routing | findNestedByScope', function () {
  test('finds top-level scope', function (assert) {
    const docs = findNestedByScope('docs', mockNested);
    assert.ok(docs, 'Should find docs scope');
    assert.strictEqual(docs?.name, 'docs', 'Should have correct name');
  });

  test('finds nested scope with slash path', function (assert) {
    const category1 = findNestedByScope('docs/category1', mockNested);
    assert.ok(category1, 'Should find nested scope');
    assert.strictEqual(category1?.name, 'category1', 'Should have correct name');
  });

  test('finds deeply nested scope', function (assert) {
    const components = findNestedByScope(
      'docs/category1/components',
      mockNested
    );
    assert.ok(components, 'Should find deeply nested scope');
    assert.strictEqual(components?.name, 'components', 'Should have correct name');
  });

  test('returns undefined for non-existent scope', function (assert) {
    const result = findNestedByScope('non-existent', mockNested);
    assert.strictEqual(result, undefined, 'Should return undefined');
  });

  test('returns root for empty scope', function (assert) {
    const result = findNestedByScope('', mockNested);
    assert.strictEqual(result, mockNested, 'Should return root nested');
  });

  test('handles trailing slashes', function (assert) {
    const result = findNestedByScope('docs/', mockNested);
    assert.ok(result, 'Should find scope with trailing slash');
    assert.strictEqual(result?.name, 'docs', 'Should have correct name');
  });

  test('handles multiple consecutive slashes', function (assert) {
    const result = findNestedByScope('docs//category1', mockNested);
    assert.ok(result, 'Should handle multiple slashes');
    assert.strictEqual(result?.name, 'category1', 'Should have correct name');
  });
});

module('Unit | Routing | addDocfyScopedRoutes', function (hooks) {
  let mockDSL: MockRouterDSL;

  hooks.beforeEach(function () {
    mockDSL = new MockRouterDSL();
  });

  test('adds routes for a specific scope', function (assert) {
    addDocfyScopedRoutes(mockDSL as any, 'docs', { nested: mockNested });

    const routeNames = mockDSL.getRouteNames();
    assert.ok(
      routeNames.includes('category1'),
      'Should include category1 route'
    );
    assert.ok(
      routeNames.includes('category2'),
      'Should include category2 route'
    );
    assert.ok(routeNames.includes('intro'), 'Should include intro route');
  });

  test('adds routes with skipChildRoutes option', function (assert) {
    addDocfyScopedRoutes(mockDSL as any, 'docs', {
      nested: mockNested,
      skipChildRoutes: true,
    });

    const routeNames = mockDSL.getRouteNames();

    // Should NOT include nested route wrappers
    assert.notOk(
      routeNames.includes('category1'),
      'Should not include category1 as nested route'
    );

    // Should include flattened paths
    assert.ok(
      routeNames.includes('category1/intro'),
      'Should include flattened route'
    );
    assert.ok(
      routeNames.includes('category1/components/button'),
      'Should include deeply flattened route'
    );
    assert.ok(
      routeNames.includes('category2/guide'),
      'Should include category2 flattened route'
    );
  });

  test('handles scope not found gracefully', function (assert) {
    // Mock console.warn to capture warning
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = function () {
      warnCalled = true;
    };

    addDocfyScopedRoutes(mockDSL as any, 'non-existent', {
      nested: mockNested,
    });

    assert.ok(warnCalled, 'Should call console.warn');
    assert.strictEqual(
      mockDSL.routes.length,
      0,
      'Should not add any routes'
    );

    console.warn = originalWarn;
  });

  test('adds routes for deeply nested scope', function (assert) {
    addDocfyScopedRoutes(mockDSL as any, 'docs/category1', {
      nested: mockNested,
    });

    const routeNames = mockDSL.getRouteNames();
    assert.ok(routeNames.includes('intro'), 'Should include intro route');
    assert.ok(
      routeNames.includes('components'),
      'Should include components route'
    );
  });

  test('handles empty pages array', function (assert) {
    const emptyNested: NestedPageMetadata = {
      name: '/',
      label: '/',
      pages: [],
      children: [
        {
          name: 'empty',
          label: 'Empty',
          pages: [],
          children: [],
        },
      ],
    };

    addDocfyScopedRoutes(mockDSL as any, 'empty', { nested: emptyNested });

    assert.strictEqual(
      mockDSL.routes.length,
      0,
      'Should handle empty pages gracefully'
    );
  });
});
