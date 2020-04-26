import Route from '@ember/routing/route';
import docfy from '@docfy/output';

export default class Docs extends Route {
  model() {
    return docfy;
  }
}
