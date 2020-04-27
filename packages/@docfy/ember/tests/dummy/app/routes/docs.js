import Route from '@ember/routing/route';
import docfy from '@docfy/output';
import { getStructedPages } from '@docfy/ember';

export default class Docs extends Route {
  model() {
    console.log(getStructedPages(docfy));

    return docfy;
  }
}
