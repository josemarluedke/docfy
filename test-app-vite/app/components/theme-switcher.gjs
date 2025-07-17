import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { on } from '@ember/modifier';

export default class ThemeSwitcher extends Component {
  @tracked prefersDark = false;

  constructor(owner, args) {
    super(owner, args);
    if (typeof window === 'undefined') {
      return;
    }
    const root = document.documentElement;
    this.prefersDark = root.classList.value.includes('mode-dark');

    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.onchange = ({ matches }) => {
      if (!localStorage.getItem('prefersMode')) {
        this.prefersDark = matches;
        this.applyClasses();
      }
    };
  }

  @action toggleMode() {
    let newMode;
    if (this.prefersDark) {
      newMode = 'light';
      this.prefersDark = false;
    } else {
      newMode = 'dark';
      this.prefersDark = true;
    }
    localStorage.setItem('prefersMode', newMode);
    this.applyClasses();
  }

  applyClasses() {
    const body = document.body;
    body.style.transition = 'background-color 0.2s ease, color 0.2s ease';
    body.style.transitionDelay = '0s, 0s';

    if (this.prefersDark) {
      document.documentElement.classList.add('mode-dark');
    } else {
      document.documentElement.classList.remove('mode-dark');
    }

    later(
      this,
      () => {
        body.style.transition = '';
        body.style.transitionDelay = '';
      },
      200
    );
  }

  <template>
    <button type="button" ...attributes {{on "click" this.toggleMode}}>
      {{#if this.prefersDark}}
        <span class="sr-only">Switch to Light Mode</span>
        <svg
          aria-hidden="true"
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          ></path>
        </svg>
      {{else}}
        <span class="sr-only">Switch to Dark Mode</span>
        <svg
          aria-hidden="true"
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
      {{/if}}
    </button>
  </template>
}

