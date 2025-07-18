import output from 'virtual:docfy-output';

/**
 * Add routes from nested page metadata
 * @param {RouterDSL} context - The router DSL context
 * @param {Object} nested - The nested page metadata
 */
function addFromNested(context, nested) {
  function add() {
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

/**
 * Add Docfy routes to the router
 * @param {RouterDSL} context - The router DSL context
 */
export function addDocfyRoutes(context) {
  addFromNested(context, output.nested);
}
