import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { schedule } from '@ember/runloop';
import { helper } from '@ember/component/helper';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { hash } from '@ember/helper';
import type Owner from '@ember/owner';
import type { TOC } from '@ember/component/template-only';

// Helper function for equality comparison
const docfyEq = helper(function docfyEq(params: unknown[]): boolean {
  return params[0] === params[1];
});

// Shared type for snippet registration
interface SnippetRegisterArgs {
  id: string;
  name: string;
}

// Description subcomponent
interface DocfyDemoDescriptionArgs {
  id?: string;
  title?: string;
  editUrl?: string;
}

interface DocfyDemoDescriptionSignature {
  Args: DocfyDemoDescriptionArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

class DocfyDemoDescription extends Component<DocfyDemoDescriptionSignature> {
  <template>
    <div
      class="docfy-demo__description"
      data-test-id="demo-description"
      ...attributes
    >
      <div class="docfy-demo__description__header" data-test-id="demo-header">
        {{#if @title}}
          <h3
            class="docfy-demo__description__header__title"
            data-test-id="demo-title"
          >
            <a href="#{{@id}}">
              <span class="icon icon-link"></span>
            </a>
            {{@title}}
          </h3>
        {{/if}}
        {{#if @editUrl}}
          <a
            href={{@editUrl}}
            target="_blank"
            rel="noopener noreferrer"
            class="docfy-demo__description__header__edit-url"
            data-test-id="demo-edit-url"
          >
            Edit this demo
          </a>
        {{/if}}
      </div>

      <div class="docfy-demo__description__content" data-test-id="demo-content">
        {{yield}}
      </div>
    </div>
  </template>
}

// Example subcomponent
interface DocfyDemoExampleSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const DocfyDemoExample: TOC<DocfyDemoExampleSignature> = <template>
  <div
    class="docfy-demo__example__container"
    data-test-id="demo-example__container"
    ...attributes
  >
    <div
      class="docfy-demo__example not-prose"
      data-test-id="demo-example"
      ...attributes
    >
      {{yield}}
    </div>
  </div>
</template>;

// Snippet subcomponent
interface DocfyDemoSnippetArgs {
  name: string;
  active: string;
  registerSnippet: (snippet: SnippetRegisterArgs) => void;
}

interface DocfyDemoSnippetSignature {
  Args: DocfyDemoSnippetArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

class DocfyDemoSnippet extends Component<DocfyDemoSnippetSignature> {
  id = guidFor(this);

  constructor(owner: Owner, args: DocfyDemoSnippetArgs) {
    super(owner, args);

    if (typeof this.args.registerSnippet === 'function') {
      let name = this.args.name || '';
      name = name.charAt(0).toUpperCase() + name.slice(1);

      this.args.registerSnippet({
        id: this.id,
        name,
      });
    }
  }

  get isActive(): boolean {
    if (typeof this.args.registerSnippet !== 'function') {
      return true;
    }

    return this.id === this.args.active;
  }

  <template>
    {{#if this.isActive}}
      <div
        class="docfy-demo__snippet"
        data-test-id="demo-snippet"
        data-test-snippet-name="{{@name}}"
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

// Snippets subcomponent
interface DocfyDemoSnippetsSignature {
  Blocks: {
    default: [any];
  };
}

class DocfyDemoSnippets extends Component<DocfyDemoSnippetsSignature> {
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

  <template>
    <div class="docfy-demo__snippets" data-test-id="demo-snippets">
      <div class="docfy-demo__snippets__tabs" data-test-id="demo-tabs">
        {{#each this.snippets as |snippet|}}
          <button
            type="button"
            class="docfy-demo__snippets__tabs__button
              {{if
                (docfyEq this.active snippet.id)
                'docfy-demo__snippets__tabs__button--active'
              }}"
            data-test-id="demo-tab-button"
            data-test-snippet-name="{{snippet.name}}"
            data-test-is-active="{{if
              (docfyEq this.active snippet.id)
              'true'
              'false'
            }}"
            {{on "click" (fn this.setActiveSnippet snippet.id)}}
          >
            {{snippet.name}}
          </button>
        {{/each}}
      </div>

      {{yield
        (component
          DocfyDemoSnippet
          registerSnippet=this.registerSnippet
          active=this.active
        )
      }}
    </div>
  </template>
}

// Main DocfyDemo component
interface DocfyDemoArgs {
  id: string;
}

interface DocfyDemoSignature {
  Args: DocfyDemoArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        Example: TOC<DocfyDemoExampleSignature>;
        Description: any;
        Snippet: any;
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
