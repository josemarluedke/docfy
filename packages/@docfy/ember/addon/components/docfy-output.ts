import Component from '@glimmer/component';
import output from '@docfy/ember/output';
import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

interface DocfyOutputArgs {
  type: 'flat' | 'nested';

  fromActiveRoute?: boolean;
  url?: string;
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

export default class DocfyOutput extends Component<DocfyOutputArgs> {
  @service router!: RouterService;

  get nestedOutput(): NestedPageMetadata | undefined {
    if (this.args.scope) {
      return output.nested.children.find((item) => {
        return item.name === this.args.scope;
      });
    }

    return output.nested;
  }

  get flatOutput(): PageMetadata[] | PageMetadata | undefined {
    let url = this.args.url;

    if (this.args.fromActiveRoute) {
      url = this.router.currentURL.split('#')[0];
    }

    if (url) {
      return flatNested(output.nested).find((item) => {
        return item.url === url || item.url === `${url}/`;
      });
    }

    return flatNested(output.nested);
  }

  get output(): NestedPageMetadata | PageMetadata[] | PageMetadata | undefined {
    let isFlat = this.args.type === 'flat';

    if (this.args.url || this.args.fromActiveRoute) {
      isFlat = true;
    }

    if (this.args.scope) {
      isFlat = false;
    }

    if (isFlat) {
      return this.flatOutput;
    } else {
      return this.nestedOutput;
    }
  }
}
