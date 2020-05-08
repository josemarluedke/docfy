import Component from '@glimmer/component';
import output from '@docfy/ember/output';
import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

interface DocfyPreviousLinkArgs {
  isPrevious?: boolean;
  scope?: string;
}

function flatNested(
  output: NestedPageMetadata,
  pages: PageMetadata[] = []
): PageMetadata[] {
  pages.push(...output.pages);

  output.children.forEach((child) => {
    flatNested(child, pages);
  });

  return pages;
}

function findPreviousOrNextPage(
  url: string,
  isPrevious: boolean,
  nested: NestedPageMetadata
): PageMetadata | undefined {
  const flat = flatNested(nested);
  const index = flat.findIndex((page) => {
    return page.url === url || page.url === `${url}/`;
  });

  if (index > -1) {
    if (isPrevious) {
      return flat[index - 1];
    } else {
      return flat[index + 1];
    }
  }
  return undefined;
}

export default class DocfyPreviousOrNextLink extends Component<
  DocfyPreviousLinkArgs
> {
  @service router!: RouterService;

  get scopedOutput(): NestedPageMetadata {
    if (typeof this.args.scope === 'string') {
      const foundScope = output.nested.children.find((child) => {
        return child.name === this.args.scope;
      });

      if (foundScope) {
        return foundScope;
      }
    }
    return output.nested;
  }

  get page(): PageMetadata | undefined {
    return findPreviousOrNextPage(
      this.router.currentURL.split('#')[0],
      this.args.isPrevious === true,
      this.scopedOutput
    );
  }
}
