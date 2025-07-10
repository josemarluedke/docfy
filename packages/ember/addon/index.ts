import output from '@docfy/ember/output';
import { NestedPageMetadata } from '@docfy/core/lib/types';

// Minimal interface for router DSL context to avoid depending on private APIs
interface RouterDSLContext {
  route(name: string, callback?: () => void): void;
}
export { default as DocfyService } from './services/docfy';

function addFromNested(context: RouterDSLContext, nested: NestedPageMetadata): void {
  function add(this: RouterDSLContext): void {
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

export function addDocfyRoutes(context: RouterDSLContext): void {
  addFromNested(context, output.nested);
}
