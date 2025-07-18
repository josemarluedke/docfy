import type { ImportStatement } from './types.js';

/**
 * Central import map for all component imports used in templates
 * This provides a single place to manage component import configuration
 *
 * Benefits:
 * - Single source of truth for component import statements
 * - Easy to update paths and import options when components are moved
 * - Type safety with ComponentName type
 * - Centralized management of all Docfy component imports
 * - Complete import configuration (path, default/named imports, etc.)
 *
 * Usage:
 * - Add new components to this map when they need to be imported in generated templates
 * - Use getComponentImport() to get the complete ImportStatement for a component
 * - Update import configuration here when components are moved or renamed
 */
export const IMPORT_MAP = {
  // Core Docfy components
  DocfyDemo: {
    name: 'DocfyDemo',
    path: 'test-app-vite/components/docfy-demo',
    isDefault: true
  },
  DocfyLink: {
    name: 'DocfyLink',
    path: 'test-app-vite/components/docfy-link',
    isDefault: true
  }

  // Add other components as needed
  // DocfyOutput: {
  //   name: 'DocfyOutput',
  //   path: 'test-app-vite/components/docfy-output',
  //   isDefault: true
  // },
  // DocfyPreviousAndNextPage: {
  //   name: 'DocfyPreviousAndNextPage',
  //   path: 'test-app-vite/components/docfy-previous-and-next-page',
  //   isDefault: true
  // },
} as const satisfies Record<string, ImportStatement>;

/**
 * Get the complete import statement for a component
 * @param componentName - The name of the component
 * @returns The complete ImportStatement object for the component
 */
export function getComponentImport(
  componentName: keyof typeof IMPORT_MAP
): ImportStatement {
  return IMPORT_MAP[componentName];
}
