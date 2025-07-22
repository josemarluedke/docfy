import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { DocfyLink } from '@docfy/ember';

interface Page {
  url: string;
  title: string;
}

interface NestedNode {
  label: string;
  pages: Page[];
  children: NestedNode[];
}

interface SidebarNavArgs {
  node: NestedNode;
}

interface SidebarNavSignature {
  Args: SidebarNavArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class SidebarNav extends Component<SidebarNavSignature> {
  @tracked isOpen = false;

  @action toggle(): void {
    this.isOpen = !this.isOpen;
  }

  @action handleSidebarClick(event: Event): void {
    if (this.isOpen) {
      const target = event.target as HTMLElement;

      if (['A', 'svg', 'path'].includes(target.tagName)) {
        let parentElement = target;

        if (target.tagName === 'path') {
          parentElement = target.parentElement?.closest('svg')
            ?.parentElement as HTMLElement;
        } else if (target.tagName === 'svg') {
          parentElement = target.parentElement as HTMLElement;
        }

        if (
          parentElement &&
          parentElement.hasAttribute('data-ignore-auto-close')
        ) {
          return;
        }

        this.toggle();
      }
    }
  }

  <template>
    <button
      type="button"
      class="flex items-center px-4 py-2 border rounded lg:hidden dark:border-gray-800
        {{if this.isOpen 'bg-gray-200 dark:bg-gray-1000'}}"
      {{on "click" this.toggle}}
    >
      <svg class="w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
          fill-rule="evenodd"
        ></path>
      </svg>
      Contents
    </button>

    <div
      class="lg:mt-0 lg:overflow-y-auto lg:sticky top-16 lg:max-h-(screen-16) pt-4 lg:pt-12 pb-4 lg:-mt-12 lg:block
        {{if this.isOpen 'block' 'hidden'}}"
    >
      <ul class="font-light space-y-3" {{on "click" this.handleSidebarClick}}>
        {{#each @node.pages as |page|}}
          <li>
            <DocfyLink
              @to={{page.url}}
              class="hover:text-green-800 dark-hover:text-green-500"
              @activeClass="font-semibold text-green-800 dark:text-green-500"
            >
              {{page.title}}
            </DocfyLink>
          </li>
        {{/each}}

        {{#each @node.children as |child|}}
          <li>
            <div class="pb-2">
              {{child.label}}
            </div>

            <ul
              class="pl-6 border-l border-gray-400 dark:border-gray-700 space-y-3"
            >
              {{#each child.pages as |page|}}
                <li class="truncate">
                  <DocfyLink
                    @to={{page.url}}
                    class="hover:text-green-800 dark-hover:text-green-500"
                    @activeClass="font-semibold text-green-800 dark:text-green-500"
                  >
                    {{page.title}}
                  </DocfyLink>
                </li>
              {{/each}}

              {{#each child.children as |subChild|}}
                <li>
                  <div class="pb-2">
                    {{subChild.label}}
                  </div>

                  <ul
                    class="pl-6 border-l border-gray-400 dark:border-gray-700 space-y-3"
                  >
                    {{#each subChild.pages as |page|}}
                      <li class="truncate">
                        <DocfyLink
                          @to={{page.url}}
                          class="hover:text-green-800 dark-hover:text-green-500"
                          @activeClass="font-semibold text-green-800 dark:text-green-500"
                        >
                          {{page.title}}
                        </DocfyLink>
                      </li>
                    {{/each}}

                    {{#each subChild.children as |subSubChild|}}
                      <li>
                        <div class="pb-2">
                          {{subSubChild.label}}
                        </div>

                        <ul
                          class="pl-6 border-l border-gray-400 dark:border-gray-700 space-y-3"
                        >
                          {{#each subSubChild.pages as |page|}}
                            <li class="truncate">
                              <DocfyLink
                                @to={{page.url}}
                                class="hover:text-green-800 dark-hover:text-green-500"
                                @activeClass="font-semibold text-green-800 dark:text-green-500"
                              >
                                {{page.title}}
                              </DocfyLink>
                            </li>
                          {{/each}}
                        </ul>
                      </li>
                    {{/each}}
                  </ul>
                </li>
              {{/each}}
            </ul>
          </li>
        {{/each}}
      </ul>
    </div>
  </template>
}
