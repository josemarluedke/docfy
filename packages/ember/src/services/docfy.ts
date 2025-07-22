import Service from '@ember/service';
import type { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { importSync } from '@embroider/macros';

// Cache the output to avoid running imports on every getter access
let cachedOutput: NestedPageMetadata | null = null;

function getDocfyOutput(): NestedPageMetadata {
  if (cachedOutput) {
    return cachedOutput;
  }

  // Both build systems now provide the same module path
  const output = importSync('@docfy/ember-output') as {
    default: { nested: NestedPageMetadata };
  };
  cachedOutput = output?.default?.nested;

  return cachedOutput;
}

function flatNested(
  output?: NestedPageMetadata,
  pages: PageMetadata[] = [],
): PageMetadata[] {
  if (typeof output === 'undefined') {
    return [];
  }

  pages.push(...output.pages);

  output.children.forEach((child) => {
    flatNested(child, pages);
  });

  return pages;
}

export default class DocfyService extends Service {
  @service declare router: RouterService;

  get flat(): PageMetadata[] {
    return flatNested(this.nested);
  }

  get nested(): NestedPageMetadata {
    return getDocfyOutput();
  }

  get currentPage(): PageMetadata | undefined {
    const currentURL = this.router.currentURL;
    if (!currentURL) return undefined;
    return this.findByUrl(currentURL);
  }

  findNestedChildrenByName(
    scope: string,
    previousNested: NestedPageMetadata | undefined | null = null,
  ): NestedPageMetadata | undefined {
    if (previousNested === null) {
      previousNested = this.nested;
    }
    const parts = scope.split('/');
    const name = parts.shift();

    const foundScope = previousNested?.children.find((item) => {
      return item.name === name;
    });

    if (parts.length > 0) {
      return this.findNestedChildrenByName(parts.join('/'), foundScope);
    }

    return foundScope;
  }

  findByUrl(url: string, scopeByNestedName?: string): PageMetadata | undefined {
    let pages = this.flat;

    if (typeof scopeByNestedName === 'string') {
      pages = flatNested(this.findNestedChildrenByName(scopeByNestedName));
    }

    const cleanedUrl = url.split('#')[0] || '';
    const finalUrl = cleanedUrl.replace(/\/$/, '');

    return pages.find((item) => {
      return item.url === finalUrl || item.url === `${finalUrl}/`;
    });
  }

  previousPage(scopeByNestedName?: string): PageMetadata | undefined {
    return this.findPreviousOrNextPage(true, scopeByNestedName);
  }

  nextPage(scopeByNestedName?: string): PageMetadata | undefined {
    return this.findPreviousOrNextPage(false, scopeByNestedName);
  }

  private findPreviousOrNextPage(
    isPrevious: boolean,
    scopeByNestedName?: string,
  ): PageMetadata | undefined {
    let pages = this.flat;

    if (typeof scopeByNestedName === 'string') {
      pages = flatNested(this.findNestedChildrenByName(scopeByNestedName));
    }

    const index = pages.findIndex((page) => {
      return page === this.currentPage;
    });

    if (index > -1) {
      if (isPrevious) {
        return this.flat[index - 1];
      } else {
        return this.flat[index + 1];
      }
    }
    return undefined;
  }
}
