import type { TOC } from '@ember/component/template-only';

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

export default DocfyDemoExample;
