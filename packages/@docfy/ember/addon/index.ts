import output from '@docfy/ember/output';
import RouterDSL from '@ember/routing/-private/router-dsl';
import { NestedOutput } from '@docfy/core/lib/types';

function addFromNested(context: RouterDSL, nested: NestedOutput): void {
  function add(this: RouterDSL): void {
    nested.pages.forEach((page) => {
      const url = page.frontmatter.relativeUrl;
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
