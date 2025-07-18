import Component from '@glimmer/component';
import { pageTitle } from 'ember-page-title';
import { service } from '@ember/service';
import { action } from '@ember/object';
import SidebarNav from './sidebar-nav';
import PageHeadings from './page-headings';
import DocfyPreviousAndNextPage from './docfy-previous-and-next-page';
import DocfyLink from './docfy-link';
import intersectHeadings from '../modifiers/intersect-headings';
import type DocfyService from '../services/docfy';
import type CurrentHeadingService from '../services/current-heading';

interface DocsLayoutArgs {
  model: {
    navigation: any;
    editUrl?: string;
  };
}

interface DocsLayoutSignature {
  Args: DocsLayoutArgs;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class DocsLayout extends Component<DocsLayoutSignature> {
  @service declare docfy: DocfyService;
  @service('current-heading') declare currentHeading: CurrentHeadingService;

  @action setCurrentHeadingId(id: string): void {
    this.currentHeading.setCurrentHeadingId(id);
  }

  <template>
    {{pageTitle "Documentation"}}

    <div class="px-4 mx-auto lg:px-6 max-w-(--breakpoint-2xl)">
      <div class="relative lg:flex">
        <div class="flex-none pt-12 pr-4 lg:w-64">
          <SidebarNav @node={{@model.navigation}} />
        </div>

        <div class="flex-1 w-full min-w-0 px-0 pt-12 lg:px-4">
          <div
            class="markdown"
            {{intersectHeadings
              this.setCurrentHeadingId
              headings=this.docfy.currentPage.headings
            }}
          >
            {{yield}}
          </div>

          <div class="flex justify-between mt-10">
            {{#if @model.editUrl}}
              <a
                href={{@model.editUrl}}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center"
              >
                <svg class="w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
                Edit this page on GitHub
              </a>
            {{/if}}
          </div>

          <div
            class="flex flex-wrap justify-between mt-5 mb-10 border-t border-gray-400 dark:border-gray-800"
          >
            <DocfyPreviousAndNextPage as |previous next|>
              <div class="flex items-center pt-6 pr-2">
                {{#if previous}}
                  <svg class="h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>
                  </svg>

                  <DocfyLink
                    @to={{previous.url}}
                    class="text-lg text-green-700 dark:text-green-500"
                  >
                    {{previous.title}}
                  </DocfyLink>
                {{/if}}
              </div>
              <div class="flex items-center pt-6 pl-2">
                {{#if next}}
                  <DocfyLink
                    @to={{next.url}}
                    class="text-lg text-green-700 dark:text-green-500"
                  >
                    {{next.title}}
                  </DocfyLink>

                  <svg class="h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                {{/if}}
              </div>
            </DocfyPreviousAndNextPage>
          </div>
        </div>

        <div class="flex-none hidden w-56 pl-4 lg:block">
          <PageHeadings />
        </div>
      </div>
    </div>
  </template>
}