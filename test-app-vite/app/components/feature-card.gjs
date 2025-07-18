import Component from '@glimmer/component';

export default class FeatureCard extends Component {
  <template>
    <div ...attributes>
      <svg
        class="mb-4"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10Z"
          fill={{if @icon @icon "#48BB78"}}
        ></path>
      </svg>
      <h4 class="pb-4 text-2xl font-semibold text-gray-100">
        {{@title}}
      </h4>
      <p class="text-gray-400">
        {{yield}}
      </p>
    </div>
  </template>
}