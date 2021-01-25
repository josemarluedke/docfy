import Service from '@ember/service';
import output from '@docfy/ember/output';
import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import flatNested from '../-private/flat-nested';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class DocfyService extends Service {
  @service router!: RouterService;

  get flat(): PageMetadata[] {
    return flatNested(this.nested);
  }

  get nested(): NestedPageMetadata {
    return output.nested;
  }

  get currentPage(): PageMetadata | undefined {
    return this.findByUrl(this.router.currentURL);
  }

  findNestedChildrenByName(name: string): NestedPageMetadata | undefined {
    return this.nested.children.find((item) => {
      return item.name === name;
    });
  }

  findByUrl(url: string, scopeByNestedName?: string): PageMetadata | undefined {
    let pages = this.flat;

    if (typeof scopeByNestedName === 'string') {
      pages = flatNested(this.findNestedChildrenByName(scopeByNestedName));
    }

    url = url.split('#')[0];

    // Make sure to always remove the trailing slash.
    // This is necessary for pre-rendered pages where the url always will end
    // with an slash.
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

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    docfy: DocfyService;
  }
}
