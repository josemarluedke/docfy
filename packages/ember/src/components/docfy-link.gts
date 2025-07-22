import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import type RouterService from '@ember/routing/router-service';

interface DocfyLinkArgs {
  to: string;
  anchor?: string;
  activeClass?: string;
}

interface DocfyLinkSignature {
  Args: DocfyLinkArgs;
  Element: HTMLAnchorElement;
  Blocks: {
    default: [];
  };
}

export default class DocfyLink extends Component<DocfyLinkSignature> {
  @service declare router: RouterService;

  get routeName(): string | undefined {
    const { to } = this.args;

    return this.router.recognize(to)?.name;
  }

  get href(): string {
    let url = this.args.to;
    if (this.routeName) {
      url = this.router.urlFor(this.routeName);
    }

    if (this.args.anchor) {
      return `${url}#${this.args.anchor}`;
    } else {
      return url;
    }
  }

  get isActive(): boolean {
    return this.router.currentRouteName === this.routeName;
  }

  @action
  navigate(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (this.routeName && !this.args.anchor) {
      event.preventDefault();
      this.router.transitionTo(this.routeName);
    }
  }

  <template>
    <a
      class="docfy-link {{if this.isActive @activeClass}}"
      ...attributes
      href={{this.href}}
      data-test-docfy-link
      data-test-to={{@to}}
      data-test-anchor={{@anchor}}
      data-test-is-active={{this.isActive}}
      {{on "click" this.navigate}}
    >
      {{yield}}
    </a>
  </template>
}
