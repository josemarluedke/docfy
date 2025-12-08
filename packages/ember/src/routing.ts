import output from '@docfy/ember/output:virtual';
import type { NestedPageMetadata } from '@docfy/core/lib/types';
import { findNestedByScope as findNestedByScopeUtil } from './utils/nested.ts';

interface RouterDSL {
  route(name: string, callback?: () => void): void;
  route(name: string, options: { path?: string; resetNamespace?: boolean }, callback?: () => void): void;
}

interface ScopedRoutingOptions {
  /**
   * The nested data structure to search through. Defaults to output.nested.
   * Useful for testing or when output is passed from elsewhere.
   */
  nested?: NestedPageMetadata;
}

/**
 * Find a nested section by scope path (e.g., 'docs' or 'docs/category1')
 * @param scope - The scope path to search for (e.g., 'docs', 'docs/category1/components')
 * @param nested - The nested structure to search in (defaults to output.nested)
 * @returns The found NestedPageMetadata or undefined if not found
 */
export function findNestedByScope(
  scope: string,
  nested: NestedPageMetadata = output.nested
): NestedPageMetadata | undefined {
  return findNestedByScopeUtil(scope, nested);
}

/**
 * Internal helper to add routes from a nested structure.
 * @param context - The RouterDSL context
 * @param nested - The nested structure to add routes from
 */
function addScopedFromNested(
  context: RouterDSL,
  nested: NestedPageMetadata
): void {
  // Add pages at this level
  nested.pages.forEach((page) => {
    const url = page.relativeUrl;
    if (typeof url === 'string' && url !== '') {
      context.route(url);
    }
  });

  // Create nested routes for children
  nested.children.forEach((child) => {
    context.route(child.name, function (this: RouterDSL) {
      addScopedFromNested(this, child);
    });
  });
}

function addFromNested(context: RouterDSL, nested: NestedPageMetadata): void {
  function add(this: RouterDSL): void {
    nested.pages.forEach((page) => {
      const url = page.relativeUrl;
      if (typeof url === 'string') {
        if (url !== '') {
          this.route(url);
        }
      }
    });

    nested.children.forEach((node) => {
      addFromNested(this, node);
    });
  }

  if (nested.name === '/') {
    add.call(context);
  } else {
    context.route(nested.name, add);
  }
}

export function addDocfyRoutes(context: RouterDSL): void {
  addFromNested(context, output.nested);
}

/**
 * Add Docfy routes for a specific scope.
 * This allows you to filter which documentation sections get routes added.
 *
 * @param context - The RouterDSL context (the 'this' from Router.map)
 * @param scope - The scope path to filter by (e.g., 'docs' or 'docs/category1')
 * @param options - Optional configuration for route generation
 *
 * @example
 * // Add routes for a specific section
 * Router.map(function () {
 *   this.route('docs', function() {
 *     this.route('core', function() {
 *       addDocfyScopedRoutes(this, 'docs/core');
 *     });
 *     this.route('ember', function() {
 *       addDocfyScopedRoutes(this, 'docs/ember');
 *     });
 *   });
 * });
 */
export function addDocfyScopedRoutes(
  context: RouterDSL,
  scope: string,
  options: ScopedRoutingOptions = {}
): void {
  const { nested = output.nested } = options;

  // Find the scoped section
  const scopedNested = findNestedByScope(scope, nested);

  if (!scopedNested) {
    console.warn(`[Docfy] Scope "${scope}" not found in nested structure`);
    return;
  }

  // Add routes for this scope
  addScopedFromNested(context, scopedNested);
}
