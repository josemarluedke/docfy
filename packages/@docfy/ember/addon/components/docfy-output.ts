import Component from '@glimmer/component';
import docfyOutput from '@docfy/output';
import { NestedRuntimeOutput, Page } from '@docfy/core/dist/types';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

interface DocfyOutputArgs {
  type: 'flat' | 'nested';

  fromActiveRoute?: boolean;
  url?: string;
  category?: string;
}

export default class DocfyOutput extends Component<DocfyOutputArgs> {
  @service router!: RouterService;

  get nestedOutput(): NestedRuntimeOutput | undefined {
    if (this.args.category) {
      return docfyOutput.nested.children.find((item) => {
        return item.name === this.args.category;
      });
    }

    return docfyOutput.nested;
  }

  get flatOutput(): Page[] | Page | undefined {
    let url = this.args.url;

    if (this.args.fromActiveRoute) {
      url = this.router.currentURL.split('#')[0];
    }

    if (url) {
      return docfyOutput.flat.find((item) => {
        return item.url === url;
      });
    }

    return docfyOutput.flat;
  }

  get output(): NestedRuntimeOutput | Page[] | Page | undefined {
    let isFlat = this.args.type === 'flat';

    if (this.args.url || this.args.fromActiveRoute) {
      isFlat = true;
    }

    if (this.args.category) {
      isFlat = false;
    }

    if (isFlat) {
      return this.flatOutput;
    } else {
      return this.nestedOutput;
    }
  }
}
