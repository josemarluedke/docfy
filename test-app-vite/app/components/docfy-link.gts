import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class DocfyLink extends Component {
  @service router;

  get routeName() {
    let { to } = this.args;

    return this.router.recognize(to)?.name;
  }

  get href() {
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

  get isActive() {
    return this.router.currentRouteName === this.routeName;
  }

  @action
  navigate(event) {
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
      class={{if this.isActive @activeClass}}
      ...attributes
      href={{this.href}}
      {{on "click" this.navigate}}
    >
      {{yield}}
    </a>
  </template>
}
