import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { scrollToElement } from '../utils/scroll-to';
import { service } from '@ember/service';
import type DocfyService from '../services/docfy';
import type CurrentHeadingService from '../services/current-heading';

interface PageHeadingsArgs {}

interface PageHeadingsSignature {
  Args: PageHeadingsArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const isEqual = (a: string, b?: string): boolean => a === b;

export default class PageHeadings extends Component<PageHeadingsSignature> {
  @service declare docfy: DocfyService;
  @service('current-heading') declare currentHeading: CurrentHeadingService;

  @action onClick(evt: Event): void {
    const target = evt.target as HTMLElement;
    const href = target.getAttribute('href');
    if (href) {
      const toElement = document.querySelector(href);
      scrollToElement(toElement);
    }
  }

  <template>
    <div
      class="overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12 text-sm"
    >
      {{#if this.docfy.currentPage.headings.length}}
        <ul>
          {{#each this.docfy.currentPage.headings as |heading|}}
            <li class="pb-2 border-l border-gray-400 dark:border-gray-700">
              <a
                href="#{{heading.id}}"
                class="block px-2 py-1 border-l-2 hover:text-green-700
                  {{if
                    (isEqual heading.id this.currentHeading.currentHeadingId)
                    'border-green-700 text-green-700 dark:border-green-500 dark:text-green-500'
                    'border-transparent'
                  }}"
                {{on "click" this.onClick}}
              >
                {{heading.title}}
              </a>

              {{#if heading.headings.length}}
                <ul class="">
                  {{#each heading.headings as |subHeading|}}
                    <li>
                      <a
                        href="#{{subHeading.id}}"
                        class="block pl-6 py-1 border-l-2 hover:text-green-700
                          {{if
                            (isEqual
                              subHeading.id this.currentHeading.currentHeadingId
                            )
                            'border-green-700 text-green-700 dark:border-green-500 dark:text-green-500'
                            'border-transparent'
                          }}"
                        {{on "click" this.onClick}}
                      >
                        {{subHeading.title}}
                      </a>
                    </li>
                  {{/each}}
                </ul>
              {{/if}}
            </li>
          {{/each}}
        </ul>
      {{/if}}
    </div>
  </template>
}
