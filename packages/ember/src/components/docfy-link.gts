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

/** Drop a trailing slash and any query string, so URLs compare by path. */
function normalizePath(url: string): string {
  const path = url.split(/[?#]/)[0] ?? '';

  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/**
 * A link to a Docfy page.
 *
 * Docfy addresses pages by URL, and `@to` is already the router's path, so
 * neither the href nor the active state needs the target route resolved.
 *
 * That matters under Embroider's `splitAtRoutes`: `RouterService#recognize()`
 * resolves the matched route handlers, and resolving a route inside a split
 * bundle makes `@embroider/router` fetch that bundle. Calling it from a getter
 * meant that merely rendering a link downloaded the page it pointed at, so a
 * page linking to every section pulled the whole documentation site up front.
 * Recognition now happens in `navigate`, where the bundle is about to be needed
 * anyway.
 */
export default class DocfyLink extends Component<DocfyLinkSignature> {
  @service('router') declare router: RouterService;

  /**
   * `@to` as the router would produce it. Docfy gives index pages a trailing
   * slash (`/docs/getting-started/`) where `urlFor` did not, so it is dropped
   * here to keep the rendered href unchanged.
   */
  get path(): string {
    return normalizePath(this.args.to);
  }

  get href(): string {
    const rootURL = this.router.rootURL?.replace(/\/+$/, '') ?? '';
    const url = `${rootURL}${this.path}`;

    if (this.args.anchor) {
      return `${url}#${this.args.anchor}`;
    } else {
      return url;
    }
  }

  get isActive(): boolean {
    const { currentURL } = this.router;

    if (!currentURL) {
      return false;
    }

    // `currentURL` is root-relative, but strip `rootURL` defensively so this
    // holds however the router reports it.
    const rootURL = this.router.rootURL?.replace(/\/+$/, '') ?? '';
    const current =
      rootURL && currentURL.startsWith(rootURL)
        ? currentURL.slice(rootURL.length)
        : currentURL;

    return normalizePath(current) === this.path;
  }

  @action
  navigate(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (this.args.anchor) {
      return;
    }

    // An unrecognised `@to` is left to the browser, as before.
    if (!this.router.recognize(this.path)) {
      return;
    }

    event.preventDefault();
    this.router.transitionTo(this.path);
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
