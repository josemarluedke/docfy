import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';
import { addDocfyRoutes } from '@docfy/ember-cli';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  addDocfyRoutes(this);
});
