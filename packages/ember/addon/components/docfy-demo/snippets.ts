import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export interface SnippetRegisterArgs {
  id: string;
  name: string;
}

export default class DocfyDemoSnippets extends Component {
  @tracked snippets: SnippetRegisterArgs[] = [];
  @tracked active?: string;

  @action registerSnippet(snippet: SnippetRegisterArgs): void {
    schedule('render', this, () => {
      this.snippets = [...this.snippets, snippet];
      if (!this.active) {
        this.active = snippet.id;
      }
    });
  }

  @action setActiveSnippet(id: string): void {
    this.active = id;
  }
}
