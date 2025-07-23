import Service from '@ember/service';
import { service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import output from '@embroider/virtual/docfy/output';
import type RouterService from '@ember/routing/router-service';
import type { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';

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
  @service('router') declare router: RouterService;

  @cached
  get currentPage() {
    const currentURL = this.router.currentURL;
    return currentURL ? this.findByUrl(currentURL) : undefined;
  }

  get flat(): PageMetadata[] {
    return flatNested(this.nested);
  }

  get nested(): NestedPageMetadata {
    return output.nested;
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
    const currentPage = this.currentPage;
    let pages = this.flat;

    if (typeof scopeByNestedName === 'string') {
      pages = flatNested(this.findNestedChildrenByName(scopeByNestedName));
    }

    const index = pages.findIndex((page) => {
      return page === currentPage;
    });

    if (index > -1) {
      if (isPrevious) {
        return pages[index - 1];
      } else {
        return pages[index + 1];
      }
    }
    return undefined;
  }
}
