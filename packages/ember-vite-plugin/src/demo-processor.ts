import type { PageContent } from '@docfy/core/lib/types';
import { DemoComponent } from './gjs-generator.js';

/**
 * Process a page's demo components and extract them for inline generation
 * This replaces the need for the ember plugin system
 */
export function processPageDemos(page: PageContent): DemoComponent[] {
  const demoComponents: DemoComponent[] = [];
  
  // Check if the page has demo components from the core plugins
  const pluginDemoComponents = page.pluginData?.demoComponents;
  
  if (Array.isArray(pluginDemoComponents)) {
    pluginDemoComponents.forEach((component: any) => {
      if (component.name && component.chunks) {
        demoComponents.push({
          name: {
            pascalCase: component.name.pascalCase,
            dashCase: component.name.dashCase
          },
          chunks: component.chunks.map((chunk: any) => ({
            ext: chunk.ext,
            code: chunk.code,
            type: chunk.type
          }))
        });
      }
    });
  }
  
  return demoComponents;
}

/**
 * Check if a page has demo components that need processing
 */
export function hasPageDemos(page: PageContent): boolean {
  const pluginDemoComponents = page.pluginData?.demoComponents;
  return Array.isArray(pluginDemoComponents) && pluginDemoComponents.length > 0;
}