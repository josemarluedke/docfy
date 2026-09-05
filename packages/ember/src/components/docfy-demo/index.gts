import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import DocfyDemoDescription from './description.gts';
import DocfyDemoExample from './example.gts';
import DocfyDemoSnippet from './snippet.gts';
import DocfyDemoSnippets from './snippets.gts';

interface DocfyDemoSignature {
  Args: { id: string };
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        Example: typeof DocfyDemoExample;
        Description: unknown;
        Snippet: typeof DocfyDemoSnippet;
        Snippets: typeof DocfyDemoSnippets;
      },
    ];
  };
}

export default class DocfyDemo extends Component<DocfyDemoSignature> {
  <template>
    <div
      id={{@id}}
      class="docfy-demo"
      data-test-id="docfy-demo"
      data-test-demo-id="{{@id}}"
      ...attributes
    >
      {{yield
        (hash
          Example=DocfyDemoExample
          Description=(component DocfyDemoDescription id=@id)
          Snippet=DocfyDemoSnippet
          Snippets=DocfyDemoSnippets
        )
      }}
    </div>
  </template>
}
