import { PageMetadata, NestedPageMetadata, SectionConfig } from '../types';

function findChild(node: NestedPageMetadata, name: string): NestedPageMetadata | undefined {
  return node.children.find(item => {
    return item.name === name;
  });
}

function sortByOrder(pages: PageMetadata[]): PageMetadata[] {
  return pages.sort((a, b) => {
    const aOrder = typeof a.frontmatter.order !== 'undefined' ? Number(a.frontmatter.order) : 998;
    const bOrder = typeof b.frontmatter.order !== 'undefined' ? Number(b.frontmatter.order) : 999;
    return aOrder - bOrder;
  });
}

function getSectionLabel(
  name: string,
  sections: Record<string, SectionConfig> = {},
  labels: Record<string, string> = {}
): string {
  // Prefer sections config, fall back to labels (backward compat), then use name
  if (sections[name]?.label) {
    return sections[name].label;
  }
  if (labels[name]) {
    return labels[name];
  }
  return name;
}

function getSectionOrder(name: string, sections: Record<string, SectionConfig> = {}): number | undefined {
  return sections[name]?.order;
}

export function transformToNestedPageMetadata(
  pages: PageMetadata[],
  labels: Record<string, string> = {},
  existingObj?: NestedPageMetadata,
  sections: Record<string, SectionConfig> = {}
): NestedPageMetadata {
  const node: NestedPageMetadata = existingObj || {
    name: '/',
    label: getSectionLabel('/', sections, labels),
    pages: [],
    children: [],
  };

  pages.forEach((item): void => {
    let url = typeof item.relativeUrl === 'string' ? item.relativeUrl : item.url;

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
            label: getSectionLabel(name, sections, labels),
            pages: [],
            children: [],
          };
          node.children.push(child);

          node.children.sort((a, b) => {
            const aOrder = getSectionOrder(a.name, sections);
            const bOrder = getSectionOrder(b.name, sections);

            // If both have order, sort by order
            if (aOrder !== undefined && bOrder !== undefined) {
              return aOrder - bOrder;
            }

            // If only a has order, a comes first
            if (aOrder !== undefined) {
              return -1;
            }

            // If only b has order, b comes first
            if (bOrder !== undefined) {
              return 1;
            }

            // If neither has order, sort alphabetically by label
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
        transformToNestedPageMetadata([item], labels, child, sections);

        sortByOrder(child.pages);
      }
    }
  });

  sortByOrder(node.pages);
  return node;
}
