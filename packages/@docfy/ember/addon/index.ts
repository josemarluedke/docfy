import output from '@docfy/ember/output';
import RouterDSL from '@ember/routing/-private/router-dsl';
import { NestedRuntimeOutput } from '@docfy/core/lib/types';

function addFromNested(context: RouterDSL, nested: NestedRuntimeOutput): void {
  function add(this: RouterDSL): void {
    nested.pages.forEach((page) => {
      const url = page.metadata.relativeUrl;
      if (typeof url === 'string') {
        this.route(url);
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
