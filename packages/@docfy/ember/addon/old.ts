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

function findRootPage(root: string): OutputPage | undefined {
  const reg = new RegExp(`^/${root}$`);

  return docfyOutput.find((page) => {
    if (page.url.match(reg)) {
      return true;
    } else {
      return false;
    }
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

interface GroupedPage {
  name: string;
  page?: OutputPage;
  children: OutputPage[];
}

export function groupPagesByRoot(
  pages: OutputPage[],
  rootToReturn?: string
): GroupedPage | GroupedPage[] | undefined {
  const grouped: GroupedPage[] = [];
  const roots = getRoots(pages);

  roots.forEach((root) => {
    const item: GroupedPage = {
      name: root,
      page: findRootPage(root),
      children: []
    };

    docfyOutput.forEach((page) => {
      if (page.url.match(new RegExp(`^/${root}/`))) {
        item.children.push(page);
      }
    });

    item.children.sort((a, b) => {
      return Number(a.metadata.order || 998) - Number(b.metadata.order || 999);
    });

    grouped.push(item);
  });

  grouped.sort((a, b) => {
    return (
      Number(a.page?.metadata.order || 998) -
      Number(b.page?.metadata.order || 999)
    );
  });

  if (typeof rootToReturn !== 'undefined') {
    return grouped.find((item) => {
      return item.name === rootToReturn;
    });
  }

  return grouped;
}

interface StructuredContent {
  pages: OutputPage[];
  categories: {
    [key: string]: OutputPage[];
  };
  packages: {
    [key: string]: StructuredContent;
  };
}

function isGroupedPage(input: unknown): input is GroupedPage {
  if (
    typeof input === 'object' &&
    typeof (input as GroupedPage)?.name !== 'undefined' &&
    typeof (input as GroupedPage)?.children !== 'undefined'
  ) {
    return true;
  }
  return false;
}

function isGroupedPages(input: unknown): input is GroupedPage[] {
  if (Array.isArray(input) && input.length > 0) {
    return isGroupedPage(input[0]);
  } else {
    return false;
  }
}

export function getStructedPages(
  input: GroupedPage | GroupedPage[] | OutputPage[],
  existingStruct?: StructuredContent
): StructuredContent {
  const structedContent: StructuredContent = existingStruct || {
    pages: [],
    categories: {},
    packages: {}
  };

  const pages: OutputPage[] = [];

  if (isGroupedPages(input)) {
    input.forEach((item) => {
      if (typeof item.page !== 'undefined') {
        pages.push(item.page);
      }

      if (item.children.length > 0) {
        pages.push(...item.children);
      }
    });
  } else if (isGroupedPage(input)) {
    if (typeof input.page !== 'undefined') {
      pages.push(input.page);
    }
    if (input.children.length > 0) {
      pages.push(...input.children);
    }
  } else {
    pages.push(...input);
  }

  pages.forEach((item): void => {
    const meta = item.metadata;
    if (typeof meta.package === 'string') {
      const pkgName = meta.package;
      structedContent.packages[pkgName] = getStructedPages(
        [{ ...item, metadata: { ...meta, package: undefined } }],
        structedContent.packages[pkgName]
      );
    } else if (typeof meta.subcategory === 'string') {
      if (!structedContent.categories[meta.subcategory]) {
        structedContent.categories[meta.subcategory] = [];
      }
      structedContent.categories[meta.subcategory].push(item);
    } else {
      structedContent.pages.push(item);
    }
  });

  structedContent.pages.sort((a, b) => {
    return Number(a.metadata.order || 998) - Number(b.metadata.order || 999);
  });

  return structedContent;
}
