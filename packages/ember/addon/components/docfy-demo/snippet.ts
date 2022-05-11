import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { SnippetRegisterArgs } from './snippets';

interface DocfyDemoSnippetArgs {
  name: string;
  active: string;
  registerSnippet: (snippet: SnippetRegisterArgs) => void;
}

export default class DocfyDemoSnippet extends Component<DocfyDemoSnippetArgs> {
  id = guidFor(this);

  constructor(owner: unknown, args: DocfyDemoSnippetArgs) {
    super(owner, args);

    if (typeof this.args.registerSnippet === 'function') {
      let name = this.args.name || '';
      name = name.charAt(0).toUpperCase() + name.slice(1);

      this.args.registerSnippet({
        id: this.id,
        name
      });
    }
  }

  get isActive(): boolean {
    if (typeof this.args.registerSnippet !== 'function') {
      return true;
    }

    return this.id === this.args.active;
  }
}
