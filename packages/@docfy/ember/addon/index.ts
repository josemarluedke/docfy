import docfyOutput from '@docfy/output';
import RouterDSL from '@ember/routing/-private/router-dsl';

export function addDocfyRoutes(context: RouterDSL): void {
  const urls = docfyOutput.map((page) => {
    return page.url[0] === '/' ? page.url.substring(1) : page.url;
  });

  const roots = urls
    .map((url) => {
      return url.split('/')[0];
    })
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

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
