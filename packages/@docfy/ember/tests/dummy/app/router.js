import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import docfy from './docfy';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('docs', function () {
    docfy.forEach((page) => {
      this.route(page.url.substring(6));
    });
  });
});
