import Component from '@glimmer/component';
import { service } from '@ember/service';
import type DocfyService from '../services/docfy';
import type { PageMetadata } from '@docfy/core/lib/types';

interface DocfyPreviousAndNextPageArgs {
  scope?: string;
}

interface DocfyPreviousAndNextPageSignature {
  Args: DocfyPreviousAndNextPageArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [
      previous: PageMetadata | undefined,
      next: PageMetadata | undefined,
    ];
  };
}

export default class DocfyPreviousAndNextPage extends Component<DocfyPreviousAndNextPageSignature> {
  @service('docfy') declare docfy: DocfyService;

  get previous(): PageMetadata | undefined {
    return this.docfy.previousPage(this.args.scope);
  }

  get next(): PageMetadata | undefined {
    return this.docfy.nextPage(this.args.scope);
  }

  <template>{{yield this.previous this.next}}</template>
}
