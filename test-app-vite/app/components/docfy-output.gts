import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

import type DocfyService from '../services/docfy';
import type { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';

interface DocfyOutputSignature {
  Args: {
    type?: 'flat' | 'nested';
    fromCurrentURL?: boolean;
    url?: string;
    scope?: string;
  };
  Blocks: {
    default: [output: NestedPageMetadata | PageMetadata[] | PageMetadata | undefined];
  };
}

export default class DocfyOutput extends Component<DocfyOutputSignature> {
  @service declare router: RouterService;
  @service declare docfy: DocfyService;

  get output(): NestedPageMetadata | PageMetadata[] | PageMetadata | undefined {
    if (this.args.url) {
      return this.docfy.findByUrl(this.args.url, this.args.scope);
    }

    if (this.args.fromCurrentURL) {
      const currentURL = this.router.currentURL;
      if (!currentURL) return undefined;
      return this.docfy.findByUrl(currentURL, this.args.scope);
    }

    if (this.args.scope) {
      return this.docfy.findNestedChildrenByName(this.args.scope);
    }

    if (this.args.type === 'flat') {
      return this.docfy.flat;
    } else {
      return this.docfy.nested;
    }
  }

  <template>{{yield this.output}}</template>
}
