import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { scrollToElement } from '../utils/scroll-to';
import { service } from '@ember/service';
import type { DocfyService } from '@docfy/ember';
import type CurrentHeadingService from '../services/current-heading';

interface PageHeadingsSignature {
  Element: HTMLDivElement;
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
      if (toElement) {
        scrollToElement(toElement as HTMLElement);
      }
    }
  }

  <template>
    <div
      class="overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12 text-sm"
      data-test-id="page-headings"
    >
      {{#if this.docfy.currentPage.headings.length}}
        <ul data-test-id="headings-list">
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
                data-test-id="heading-link"
                data-test-heading-id="{{heading.id}}"
                data-test-is-active="{{if
                  (isEqual heading.id this.currentHeading.currentHeadingId)
                  'true'
                  'false'
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
                        data-test-id="subheading-link"
                        data-test-heading-id="{{subHeading.id}}"
                        data-test-is-active="{{if
                          (isEqual
                            subHeading.id this.currentHeading.currentHeadingId
                          )
                          'true'
                          'false'
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
