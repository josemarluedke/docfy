import docfyOutput, { OutputPage } from '@docfy/output';
import RouterDSL from '@ember/routing/-private/router-dsl';

function getRoots(pages: OutputPage[]): string[] {
  return pages
    .map((page) => {
      return page.url.split('/')[1];
    })
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
}

export function addDocfyRoutes(context: RouterDSL): void {
  const urls = docfyOutput.map((page) => {
    return page.url.substring(1); // remove leading slash
  });

  const roots = getRoots(docfyOutput);

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

interface DocfyNode {
  name: string;
  pages: OutputPage[];
  children: DocfyNode[];
}

function findChild(node: DocfyNode, name: string): DocfyNode | undefined {
  return node.children.find((item) => {
    return item.name === name;
  });
}

function sortByOrder(pages: OutputPage[]): OutputPage[] {
  return pages.sort((a, b) => {
    const aOrder =
      typeof a.metadata.order !== 'undefined' ? Number(a.metadata.order) : 998;
    const bOrder =
      typeof b.metadata.order !== 'undefined' ? Number(b.metadata.order) : 999;
    return aOrder - bOrder;
  });
}

export function getStructedPages(
  pages: OutputPage[],
  existingStruct?: DocfyNode
): DocfyNode {
  const node: DocfyNode = existingStruct || {
    name: '/',
    pages: [],
    children: []
  };

  pages.forEach((item): void => {
    let url = (item.metadata.relativeUrl as string) || item.url;
    url = url[0] === '/' ? url.substring(1) : url;
    const urlParts = url.split('/');

    if (urlParts.length === 1) {
      item.metadata.relativeUrl = urlParts[0];
      node.pages.push(item);
    } else {
      const name = urlParts.shift();

      if (typeof name === 'string') {
        let child = findChild(node, name);

        if (!child) {
          child = {
            name: name,
            pages: [],
            children: []
          };
          node.children.push(child);
        }

        item.metadata.relativeUrl = urlParts.join('/');
        getStructedPages([item], child);

        sortByOrder(child.pages);
      }
    }
  });

  sortByOrder(node.pages);
  return node;
}
