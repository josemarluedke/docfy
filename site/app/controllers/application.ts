import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class Application extends Controller {
  @service router!: RouterService;

  get isIndex(): boolean {
    return this.router.currentRouteName == 'index';
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: Application;
  }
}
