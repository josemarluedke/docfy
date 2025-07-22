import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { DocfyService } from '@docfy/ember';
import type { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';

interface DocsRouteModel {
  navigation: NestedPageMetadata;
  headings: PageMetadata['headings'];
  editUrl?: string;
}

export default class DocsRoute extends Route {
  @service declare docfy: DocfyService;

  async model(): Promise<DocsRouteModel> {
    const currentPage = this.docfy.currentPage;

    return {
      navigation: this.docfy.nested,
      headings: currentPage?.headings || [],
      editUrl: currentPage?.editUrl,
    };
  }
}
