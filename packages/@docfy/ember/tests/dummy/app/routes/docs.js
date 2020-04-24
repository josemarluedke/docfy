import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import docfy from 'dummy/docfy';

export default class Docs extends Route {
  @service router;

  model() {
    return docfy.map((page) => {
      return {
        ...page,
        route: this.router.recognize(page.url).name
      };
    });
  }
}
