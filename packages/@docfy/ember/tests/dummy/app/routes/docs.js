import Route from '@ember/routing/route';
import docfy from '@docfy/output';
import { getStructedPages } from '@docfy/ember';

export default class Docs extends Route {
  model() {
    const result = getStructedPages(docfy);

    console.log(result);

    return result.children.find((item) => {
      return item.name === 'docs';
    });
    // return result;
  }
}
