import { pageTitle } from 'ember-page-title';
import SidebarNav from '../components/sidebar-nav';
import PageHeadings from '../components/page-headings';
import intersectHeadings from '../modifiers/intersect-headings';

<template>
  {{pageTitle "Documentation"}}

  <div class="px-4 mx-auto lg:px-6 max-w-screen-2xl">
    <div class="relative lg:flex">
      <div class="flex-none pt-12 pr-4 lg:w-64">
        {{! TODO: Use DocfyOutput once virtual modules are working }}
        <SidebarNav @node={{@model.navigation}} />
      </div>

      <div class="flex-1 w-full min-w-0 px-0 pt-12 lg:px-4">
        <div
          class="markdown"
          {{intersectHeadings
            this.setCurrentHeadingId
            headings=@model.headings
          }}
        >
          {{outlet}}
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
          {{! TODO: Add previous/next navigation }}
        </div>
      </div>

      <div class="flex-none hidden w-56 pl-4 lg:block">
        <PageHeadings
          @currentHeadingId={{this.currentHeadingId}}
          @headings={{@model.headings}}
        />
      </div>
    </div>
  </div>
</template>

