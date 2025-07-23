import Route from '@ember/routing/route';
import * as docfy from '@docfy/ember';

export default class Docs extends Route {
  model() {
    console.log(docfy);
  }
}
