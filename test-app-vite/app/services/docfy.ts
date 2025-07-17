import Service from '@ember/service';
import output from 'virtual:docfy-output';
import type { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import RouterService from '@ember/routing/router-service';

function flatNested(
  output?: NestedPageMetadata,
  pages: PageMetadata[] = []
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
  router!: RouterService;

  get flat(): PageMetadata[] {
    return flatNested(this.nested);
  }

  get nested(): NestedPageMetadata {
    return output.nested;
  }

  get currentPage(): PageMetadata | undefined {
    return this.findByUrl(this.router.currentURL);
  }

  findNestedChildrenByName(
    scope: string,
    previousNested: NestedPageMetadata | undefined | null = null
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

    url = url.split('#')[0];
    url = url.replace(/\/$/, '');

    return pages.find((item) => {
      return item.url === url || item.url === `${url}/`;
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
    scopeByNestedName?: string
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