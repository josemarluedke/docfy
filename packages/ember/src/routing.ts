import output from 'virtual:docfy/output';
import type RouterDSL from '@ember/routing/-private/router-dsl';
import type { NestedPageMetadata } from '@docfy/core/lib/types';

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
