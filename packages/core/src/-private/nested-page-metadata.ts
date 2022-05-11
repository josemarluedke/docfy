import { PageMetadata, NestedPageMetadata } from '../types';

function findChild(
  node: NestedPageMetadata,
  name: string
): NestedPageMetadata | undefined {
  return node.children.find((item) => {
    return item.name === name;
  });
}

function sortByOrder(pages: PageMetadata[]): PageMetadata[] {
  return pages.sort((a, b) => {
    const aOrder =
      typeof a.frontmatter.order !== 'undefined'
        ? Number(a.frontmatter.order)
        : 998;
    const bOrder =
      typeof b.frontmatter.order !== 'undefined'
        ? Number(b.frontmatter.order)
        : 999;
    return aOrder - bOrder;
  });
}

export function transformToNestedPageMetadata(
  pages: PageMetadata[],
  labels: Record<string, string> = {},
  existingObj?: NestedPageMetadata
): NestedPageMetadata {
  const node: NestedPageMetadata = existingObj || {
    name: '/',
    label: labels['/'] || '/',
    pages: [],
    children: []
  };

  pages.forEach((item): void => {
    let url =
      typeof item.relativeUrl === 'string' ? item.relativeUrl : item.url;

    url = url[0] === '/' ? url.substring(1) : url;
    const urlParts = url.split('/');

    item.parentLabel = node.label;

    if (urlParts.length === 1) {
      item.relativeUrl = urlParts[0];
      node.pages.push(item);
    } else {
      const name = urlParts.shift();

      if (typeof name === 'string') {
        let child = findChild(node, name);

        if (!child) {
          child = {
            name: name,
            label: labels[name] || name,
            pages: [],
            children: []
          };
          node.children.push(child);

          node.children.sort((a, b) => {
            const labelA = a.label.toUpperCase();
            const labelB = b.label.toUpperCase();
            if (labelA < labelB) {
              return -1;
            }
            if (labelA > labelB) {
              return 1;
            }

            return 0;
          });
        }

        item.relativeUrl = urlParts.join('/');
        transformToNestedPageMetadata([item], labels, child);

        sortByOrder(child.pages);
      }
    }
  });

  sortByOrder(node.pages);
  return node;
}
