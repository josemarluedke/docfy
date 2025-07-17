import { pageTitle } from 'ember-page-title';
import DocfyLink from '../components/docfy-link';

<template>
  {{pageTitle "Home"}}

  <div class="px-4 mx-auto lg:px-6 max-w-screen-2xl">
    <div class="py-16 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Docfy
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        A modern documentation site generator for Ember.js
      </p>

      <div class="space-x-4">
        <DocfyLink
          @to="/docs"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Get Started
        </DocfyLink>

        <a
          href="https://github.com/josemarluedke/docfy"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          View on GitHub
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
      <div class="text-center">
        <div
          class="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Fast</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Built with Vite for lightning-fast development and building
        </p>
      </div>

      <div class="text-center">
        <div
          class="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Modern</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Uses GJS components and the latest Ember patterns
        </p>
      </div>

      <div class="text-center">
        <div
          class="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Flexible</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Extensible plugin system and markdown-based content
        </p>
      </div>
    </div>
  </div>
</template>

