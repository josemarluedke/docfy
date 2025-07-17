import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { schedule } from '@ember/runloop';
import { helper } from '@ember/component/helper';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

// Helper function for equality comparison
const docfyEq = helper(function docfyEq(params: unknown[]): boolean {
  return params[0] === params[1];
});

// Type definitions
interface DocfyDemoArgs {
  id: string;
}

interface DocfyDemoDescriptionArgs {
  id?: string;
  title?: string;
  editUrl?: string;
}

interface SnippetRegisterArgs {
  id: string;
  name: string;
}

interface DocfyDemoSnippetArgs {
  name: string;
  active: string;
  registerSnippet: (snippet: SnippetRegisterArgs) => void;
}

// Description subcomponent
const Description = <template>
  <div class="docfy-demo__description" ...attributes>
    <div class="docfy-demo__description__header">
      {{#if @title}}
        <h3 class="docfy-demo__description__header__title">
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
        >
          Edit this demo
        </a>
      {{/if}}
    </div>

    <div class="docfy-demo__description__content">
      {{yield}}
    </div>
  </div>
</template>;

// Example subcomponent
const Example = <template>
  <div class="docfy-demo__example not-prose" ...attributes>
    {{yield}}
  </div>
</template>;

// Snippet subcomponent class
class DocfyDemoSnippet extends Component<DocfyDemoSnippetArgs> {
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

  <template>
    {{#if this.isActive}}
      <div class="docfy-demo__snippet" ...attributes>
        {{yield}}
      </div>
    {{/if}}
  </template>
}

// Snippets subcomponent class
class DocfyDemoSnippets extends Component {
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
    <div class="docfy-demo__snippets">
      <div class="docfy-demo__snippets__tabs">
        {{#each this.snippets as |snippet|}}
          <button
            type="button"
            class="docfy-demo__snippets__tabs__button {{
              if
              (docfyEq this.active snippet.id)
              "docfy-demo__snippets__tabs__button--active"
            }}"
            {{on "click" (fn this.setActiveSnippet snippet.id)}}
          >
            {{snippet.name}}
          </button>
        {{/each}}
      </div>

      {{yield (component DocfyDemoSnippet registerSnippet=this.registerSnippet active=this.active)}}
    </div>
  </template>
}

// Main DocfyDemo component
export default class DocfyDemo extends Component<DocfyDemoArgs> {
  <template>
    <div id={{@id}} class="docfy-demo" ...attributes>
      {{yield
        (hash
          Example=Example
          Description=(component Description id=@id)
          Snippet=DocfyDemoSnippet
          Snippets=DocfyDemoSnippets
        )
      }}
    </div>
  </template>
}