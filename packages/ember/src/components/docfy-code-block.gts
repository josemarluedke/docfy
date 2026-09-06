import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

interface DocfyCodeBlockSignature {
  Args: {
    title?: string;
    language?: string;
    collapsible?: boolean;
    showLineNumbers?: boolean;
    copyable?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

const COPIED_FEEDBACK_MS = 2000;

export default class DocfyCodeBlock extends Component<DocfyCodeBlockSignature> {
  @tracked isExpanded = false;
  @tracked didCopy = false;

  private copyTimeout?: ReturnType<typeof setTimeout>;

  // Clipboard access needs a secure context. Rather than render a button that
  // silently does nothing, hide it when the API is absent.
  get isCopyable(): boolean {
    return (
      this.args.copyable !== false &&
      typeof navigator !== 'undefined' &&
      Boolean(navigator.clipboard)
    );
  }

  get isCollapsible(): boolean {
    return this.args.collapsible === true;
  }

  get isCollapsed(): boolean {
    return this.isCollapsible && !this.isExpanded;
  }

  get toggleLabel(): string {
    return this.isExpanded ? 'Collapse' : 'Expand';
  }

  @action toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  @action async copy(event: MouseEvent): Promise<void> {
    const button = event.currentTarget as HTMLElement;
    const pre = button.closest('.docfy-code-block')?.querySelector('pre');

    if (!pre) {
      return;
    }

    await navigator.clipboard.writeText(pre.textContent ?? '');

    this.didCopy = true;
    clearTimeout(this.copyTimeout);
    this.copyTimeout = setTimeout(() => {
      this.didCopy = false;
    }, COPIED_FEEDBACK_MS);
  }

  willDestroy(): void {
    super.willDestroy();
    clearTimeout(this.copyTimeout);
  }

  <template>
    <div
      class="docfy-code-block
        {{if this.isCollapsed 'docfy-code-block--collapsed'}}
        {{if @showLineNumbers 'docfy-code-block--line-numbers'}}"
      data-test-id="code-block"
      data-language="{{@language}}"
      ...attributes
    >
      {{#if @title}}
        <div class="docfy-code-block__header" data-test-id="code-block-header">
          <span class="docfy-code-block__header__title">{{@title}}</span>
        </div>
      {{/if}}

      {{#if this.isCopyable}}
        <button
          type="button"
          class="docfy-code-block__copy"
          data-test-id="code-block-copy"
          data-test-copied="{{if this.didCopy 'true' 'false'}}"
          aria-label="Copy code to clipboard"
          {{on "click" this.copy}}
        >
          <span aria-hidden="true">{{if this.didCopy "Copied" "Copy"}}</span>
        </button>
        <span class="docfy-code-block__status" aria-live="polite">
          {{#if this.didCopy}}Copied to clipboard{{/if}}
        </span>
      {{/if}}

      <div class="docfy-code-block__content">
        {{yield}}
      </div>

      {{#if this.isCollapsible}}
        <button
          type="button"
          class="docfy-code-block__toggle"
          data-test-id="code-block-toggle"
          aria-expanded="{{if this.isExpanded 'true' 'false'}}"
          {{on "click" this.toggle}}
        >
          {{this.toggleLabel}}
        </button>
      {{/if}}
    </div>
  </template>
}
