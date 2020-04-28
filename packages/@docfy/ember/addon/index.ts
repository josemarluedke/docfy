import { Page } from '@docfy/core/dist/types';
import docfyOutput from '@docfy/output';
import RouterDSL from '@ember/routing/-private/router-dsl';

function getRoots(pages: Page[]): string[] {
  return pages
    .map((page) => {
      return page.url.split('/')[1];
    })
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
}

// TODO move to use nested output instead
export function addDocfyRoutes(context: RouterDSL): void {
  const urls = docfyOutput.flat.map((page) => {
    return page.url.substring(1); // remove leading slash
  });

  const roots = getRoots(docfyOutput.flat);

  roots.forEach((root) => {
    context.route(root, function () {
      const reg = new RegExp(`^${root}/`);

      urls.forEach((url) => {
        const child = url.replace(reg, '');

        if (url.match(reg)) {
          this.route(child);
        }
      });
    });
  });
}
