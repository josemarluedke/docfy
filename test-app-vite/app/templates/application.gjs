import { pageTitle } from 'ember-page-title';
import ThemeSwitcher from '../components/theme-switcher';

<template>
  {{pageTitle "Docfy"}}

  <div
    class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
  >
    <nav
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
    >
      <div class="px-4 mx-auto lg:px-6 max-w-screen-2xl">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <a
              href="/"
              class="text-xl font-bold text-green-700 dark:text-green-500"
            >
              Docfy
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            />
          </div>
        </div>
      </div>
    </nav>

    <main>
      {{outlet}}
    </main>
  </div>
</template>
