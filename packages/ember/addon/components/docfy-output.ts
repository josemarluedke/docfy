import Component from '@glimmer/component';
import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import DocfyService from '../services/docfy';

interface DocfyOutputArgs {
  type?: 'flat' | 'nested';
  fromCurrentURL?: boolean;
  url?: string;
  scope?: string;
}

export default class DocfyOutput extends Component<DocfyOutputArgs> {
  @service router!: RouterService;
  @service docfy!: DocfyService;

  get output(): NestedPageMetadata | PageMetadata[] | PageMetadata | undefined {
    if (this.args.url) {
      return this.docfy.findByUrl(this.args.url, this.args.scope);
    }

    if (this.args.fromCurrentURL) {
      return this.docfy.findByUrl(this.router.currentURL, this.args.scope);
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
}
