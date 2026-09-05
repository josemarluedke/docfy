import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';

interface DocfyDemoSnippetSignature {
  Args: {
    name: string;
    // Named lowercase (not `Tab`): Ember's template compiler reserves any
    // `@ArgName` whose first character isn't lowercase, so a directly
    // invoked contextual component arg like `<@Tab>` fails to compile.
    tab?: ComponentLike<{
      Args: { label: string };
      Element: HTMLDivElement;
      Blocks: { default: [] };
    }>;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

export default class DocfyDemoSnippet extends Component<DocfyDemoSnippetSignature> {
  // The tab strip has always shown a capitalised name; keep that exact
  // transformation so `[data-test-snippet-name="Template"]` still matches.
  get label(): string {
    const name = this.args.name || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  <template>
    {{#if @tab}}
      <@tab
        @label={{this.label}}
        class="docfy-demo__snippet"
        data-test-id="demo-snippet"
        data-test-snippet-name="{{@name}}"
        ...attributes
      >
        {{yield}}
      </@tab>
    {{else}}
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
