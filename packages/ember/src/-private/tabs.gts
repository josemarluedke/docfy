import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { schedule } from '@ember/runloop';
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import type Owner from '@ember/owner';
import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

export interface TabRegistration {
  id: string;
  label: string;
}

interface TabArgs {
  label: string;
  active?: string;
  registerTab?: (tab: TabRegistration) => void;
}

interface TabSignature {
  Args: TabArgs;
  Blocks: { default: [] };
}

export class Tab extends Component<TabSignature> {
  id = guidFor(this);

  constructor(owner: Owner, args: TabArgs) {
    super(owner, args);

    if (typeof this.args.registerTab === 'function') {
      this.args.registerTab({ id: this.id, label: this.args.label });
    }
  }

  // Rendered outside a Tabs (the single-snippet demo case) there is no
  // registration, and the panel is always visible.
  get isActive(): boolean {
    if (typeof this.args.registerTab !== 'function') {
      return true;
    }
    return this.id === this.args.active;
  }

  <template>
    {{#if this.isActive}}
      {{yield}}
    {{/if}}
  </template>
}

interface TabsListArgs {
  items: TabRegistration[];
  select: (id: string) => void;
  isActive: (id: string) => boolean;
}

interface TabsListSignature {
  Args: TabsListArgs;
  Element: HTMLDivElement;
}

const TabsList: TOC<TabsListSignature> = <template>
  <div
    class="docfy-tabs__list"
    role="tablist"
    data-test-id="docfy-tabs-list"
    ...attributes
  >
    {{#each @items as |tab|}}
      <button
        type="button"
        role="tab"
        class="docfy-tabs__list__button
          {{if (@isActive tab.id) 'docfy-tabs__list__button--active'}}"
        data-test-id="docfy-tabs-button"
        data-test-tab-label="{{tab.label}}"
        aria-selected="{{if (@isActive tab.id) 'true' 'false'}}"
        {{on "click" (fn @select tab.id)}}
      >
        {{tab.label}}
      </button>
    {{/each}}
  </div>
</template>;

interface TabsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        Tab: ComponentLike<{
          Args: { label: string };
          Blocks: { default: [] };
        }>;
        List: ComponentLike<{ Element: HTMLDivElement }>;
        items: TabRegistration[];
        select: (id: string) => void;
        isActive: (id: string) => boolean;
      },
    ];
  };
}

export default class Tabs extends Component<TabsSignature> {
  @tracked items: TabRegistration[] = [];
  @tracked active?: string;

  @action registerTab(tab: TabRegistration): void {
    schedule('render', this, () => {
      this.items = [...this.items, tab];
      if (!this.active) {
        this.active = tab.id;
      }
    });
  }

  @action select(id: string): void {
    this.active = id;
  }

  isActive = (id: string): boolean => this.active === id;

  <template>
    <div class="docfy-tabs" data-test-id="docfy-tabs" ...attributes>
      {{yield
        (hash
          Tab=(component Tab registerTab=this.registerTab active=this.active)
          List=(component
            TabsList items=this.items select=this.select isActive=this.isActive
          )
          items=this.items
          select=this.select
          isActive=this.isActive
        )
      }}
    </div>
  </template>
}
