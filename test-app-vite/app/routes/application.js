import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  afterModel() {
    this.controllerFor('application').send('didTransition');
  }
}