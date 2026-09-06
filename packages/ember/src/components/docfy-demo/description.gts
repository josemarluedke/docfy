import Component from '@glimmer/component';

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

export default class DocfyDemoDescription extends Component<DocfyDemoDescriptionSignature> {
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
