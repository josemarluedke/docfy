import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import config from 'ember-get-config';

interface DocfyLinkArgs {
  to: string;
  anchor?: string;
  activeClass?: string;
}

export default class DocfyLink extends Component<DocfyLinkArgs> {
  @service router!: RouterService;

  get routeName(): string {
    let { to } = this.args;

    if (config.rootURL && config.rootURL !== '/') {
      to = to.replace(/^\//, config.rootURL);
    }

    return (this.router as any).recognize(to)?.name; // eslint-disable-line
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
}
