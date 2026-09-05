import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import Tabs from '../../-private/tabs.gts';
import DocfyDemoSnippet from './snippet.gts';

interface DocfyDemoSnippetsSignature {
  Blocks: {
    default: [unknown];
  };
}

export default class DocfyDemoSnippets extends Component<DocfyDemoSnippetsSignature> {
  <template>
    <div class="docfy-demo__snippets" data-test-id="demo-snippets">
      <Tabs as |tabs|>
        <div
          class="docfy-demo__snippets__tabs"
          data-test-id="demo-tabs"
          role="tablist"
        >
          {{#each tabs.items as |tab|}}
            <button
              type="button"
              role="tab"
              class="docfy-demo__snippets__tabs__button
                {{if
                  (tabs.isActive tab.id)
                  'docfy-demo__snippets__tabs__button--active'
                }}"
              data-test-id="demo-tab-button"
              data-test-snippet-name="{{tab.label}}"
              data-test-is-active="{{if (tabs.isActive tab.id) 'true' 'false'}}"
              aria-selected="{{if (tabs.isActive tab.id) 'true' 'false'}}"
              {{on "click" (fn tabs.select tab.id)}}
            >
              {{tab.label}}
            </button>
          {{/each}}
        </div>

        {{yield (component DocfyDemoSnippet tab=tabs.Tab)}}
      </Tabs>
    </div>
  </template>
}
