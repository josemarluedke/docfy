import Component from '@glimmer/component';
import { DocfyOutput } from '@docfy/ember';
import DocfyLink from '@docfy/ember/components/docfy-link';

interface DocsSectionNavSignature {
  Element: HTMLElement;
}

export default class DocsSectionNav extends Component<DocsSectionNavSignature> {
  <template>
    <DocfyOutput @scope='docs' as |node|>
      <nav
        class='border-b border-neutral-400/20 dark:border-neutral-600/20 mb-8'
        data-test-id='section-nav'
      >
        <div class='flex gap-8'>
          {{#each node.children as |child|}}
            {{#if child.pages.[0]}}
              <DocfyLink
                @to={{child.pages.[0].url}}
                class='pb-3 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                @activeClass='text-green-700 dark:text-green-500 border-b-2 border-green-700 dark:border-green-500'
              >
                {{child.label}}
              </DocfyLink>
            {{/if}}
          {{/each}}
        </div>
      </nav>
    </DocfyOutput>
  </template>
}
