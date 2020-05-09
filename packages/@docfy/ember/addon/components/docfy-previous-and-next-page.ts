import Component from '@glimmer/component';
import DocfyService from '../services/docfy';
import { PageMetadata } from '@docfy/core/lib/types';
import { inject as service } from '@ember/service';

interface DocfyPreviousAndNextPageArgs {
  scope?: string;
}

export default class DocfyPreviousAndNextPage extends Component<
  DocfyPreviousAndNextPageArgs
> {
  @service docfy!: DocfyService;

  get previous(): PageMetadata | undefined {
    return this.docfy.previousPage(this.args.scope);
  }

  get next(): PageMetadata | undefined {
    return this.docfy.nextPage(this.args.scope);
  }
}
