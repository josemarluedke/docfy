import Component from '@glimmer/component';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import Tabs from '../-private/tabs.gts';
import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

// The internal `Tab` renders no element of its own — it is purely a visibility
// gate — so each public tab component owns its panel markup. That is what keeps
// `docfy-demo`'s snippet DOM byte-identical to its pre-refactor markup.
interface DocfyCodeTabSignature {
  Args: {
    label: string;
    tab?: ComponentLike<{ Args: { label: string }; Blocks: { default: [] } }>;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

const DocfyCodeTab: TOC<DocfyCodeTabSignature> = <template>
  {{#let @tab as |Tab|}}
    <Tab @label={{@label}}>
      <div
        class="docfy-code-tabs__panel"
        data-test-id="code-tabs-panel"
        data-test-tab-label="{{@label}}"
        ...attributes
      >
        {{yield}}
      </div>
    </Tab>
  {{/let}}
</template>;

interface DocfyCodeTabsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [{ Tab: unknown }];
  };
}

export default class DocfyCodeTabs extends Component<DocfyCodeTabsSignature> {
  <template>
    <div class="docfy-code-tabs" data-test-id="code-tabs" ...attributes>
      <Tabs as |tabs|>
        <div
          class="docfy-code-tabs__list"
          data-test-id="code-tabs-list"
          role="tablist"
        >
          {{#each tabs.items as |tab|}}
            <button
              type="button"
              role="tab"
              class="docfy-code-tabs__list__button
                {{if
                  (tabs.isActive tab.id)
                  'docfy-code-tabs__list__button--active'
                }}"
              data-test-id="code-tabs-button"
              data-test-tab-label="{{tab.label}}"
              aria-selected="{{if (tabs.isActive tab.id) 'true' 'false'}}"
              {{on "click" (fn tabs.select tab.id)}}
            >
              {{tab.label}}
            </button>
          {{/each}}
        </div>

        {{yield (hash Tab=(component DocfyCodeTab tab=tabs.Tab))}}
      </Tabs>
    </div>
  </template>
}
