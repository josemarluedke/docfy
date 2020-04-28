import { Page, PageContent, RuntimeOutput, NestedRuntimeOutput } from './types';

function findChild(
  node: NestedRuntimeOutput,
  name: string
): NestedRuntimeOutput | undefined {
  return node.children.find((item) => {
    return item.name === name;
  });
}

function sortByOrder(pages: Page[]): Page[] {
  return pages.sort((a, b) => {
    const aOrder =
      typeof a.metadata.order !== 'undefined' ? Number(a.metadata.order) : 998;
    const bOrder =
      typeof b.metadata.order !== 'undefined' ? Number(b.metadata.order) : 999;
    return aOrder - bOrder;
  });
}

export function genereateFlatOutput(pageContents: PageContent[]): Page[] {
  const pages: Page[] = pageContents.map((page) => {
    const { url, headings, title, source, metadata } = page;

    return {
      url,
      headings,
      title,
      source,
      metadata
    };
  });

  return sortByOrder(pages);
}

export function generateNestedOutput(
  pages: Page[],
  labels: Record<string, string> = {},
  existingObj?: NestedRuntimeOutput
): NestedRuntimeOutput {
  const node: NestedRuntimeOutput = existingObj || {
    name: '/',
    label: labels['/'] || '/',
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
            label: labels[name] || name,
            pages: [],
            children: []
          };
          node.children.push(child);
        }

        item.metadata.relativeUrl = urlParts.join('/');
        generateNestedOutput([item], labels, child);

        sortByOrder(child.pages);
      }
    }
  });

  sortByOrder(node.pages);
  return node;
}

export function generateRuntimeOutput(
  pageContents: PageContent[],
  labels: Record<string, string> = {}
): RuntimeOutput {
  const flat = genereateFlatOutput(pageContents);
  const nested = generateNestedOutput(flat, labels);

  return { flat, nested };
}
