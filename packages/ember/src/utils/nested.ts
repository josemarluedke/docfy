import type { NestedPageMetadata } from '@docfy/core/lib/types';

/**
 * Find a nested section by scope path (e.g., 'docs' or 'docs/category1').
 * This is a shared utility used by both the routing module and the DocfyService.
 *
 * @param scope - The scope path to search for (e.g., 'docs', 'docs/category1/components')
 * @param nested - The nested structure to search in
 * @returns The found NestedPageMetadata or undefined if not found
 */
export function findNestedByScope(
  scope: string,
  nested: NestedPageMetadata
): NestedPageMetadata | undefined {
  const parts = scope.split('/').filter((part) => part !== ''); // Filter out empty parts

  if (parts.length === 0) {
    return nested; // Return root if scope is empty or '/'
  }

  const name = parts.shift();

  // Find in children
  const foundScope =
    nested.name === name
      ? nested
      : nested.children.find((child) => child.name === name);

  // If more parts remain, recursively search
  if (foundScope && parts.length > 0) {
    return findNestedByScope(parts.join('/'), foundScope);
  }

  return foundScope;
}
