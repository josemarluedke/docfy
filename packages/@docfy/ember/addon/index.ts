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
    console.log(item.name, name, item.name === name);
    return item.name === name;
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
    const meta = item.metadata;
    if (typeof meta.category === 'string') {
      const pkgName = meta.category;
      let child = findChild(node, pkgName);

      if (!child) {
        child = {
          name: pkgName,
          pages: [],
          children: []
        };
        node.children.push(child);
      }

      getStructedPages(
        [{ ...item, metadata: { ...meta, category: undefined } }],
        child
      );
    } else if (typeof meta.subcategory === 'string') {
      let child = findChild(node, meta.subcategory);

      if (!child) {
        child = {
          name: meta.subcategory,
          pages: [],
          children: []
        };
        node.children.push(child);
      }

      child.pages.push(item);

      child.pages.sort((a, b) => {
        return (
          Number(a.metadata.order || 998) - Number(b.metadata.order || 999)
        );
      });
    } else {
      node.pages.push(item);
    }
  });

  node.pages.sort((a, b) => {
    return Number(a.metadata.order || 998) - Number(b.metadata.order || 999);
  });

  return node;
}
