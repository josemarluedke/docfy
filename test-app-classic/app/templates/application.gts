import pageTitle from 'ember-page-title/helpers/page-title';
import { DocfyLink, DocfyOutput } from '@docfy/ember';
import { get } from '@ember/object';

<template>
  {{pageTitle "Docfy Classic"}}

  <div class="p-4 mb-4 text-white bg-gray-900">
    <div class="flex mx-auto max-w-screen-xl">
      <h1 class="mr-12 font-bold leading-relaxed text-blue-400">
        Docfy
      </h1>
      <DocfyOutput @type="nested" as |node|>
        <ul>
          {{#each node.pages as |page|}}
            <li>
              <DocfyLink @to={{page.url}}>
                {{page.title}}
              </DocfyLink>
            </li>
          {{/each}}

          {{#each node.children as |child|}}
            {{#let (get child.pages 0) as |page|}}
              {{#if page}}
                <li>
                  <DocfyLink @to={{page.url}} class="pb-4">
                    {{child.label}}
                  </DocfyLink>
                </li>
              {{/if}}
            {{/let}}
          {{/each}}
        </ul>
      </DocfyOutput>
    </div>
  </div>

  <div class="mx-auto max-w-screen-xl">
    {{outlet}}
  </div>
</template>
