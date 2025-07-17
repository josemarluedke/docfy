import EmberRouter from '@ember/routing/router';
import config from 'test-app-vite/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // For now, we'll add routes manually until we implement addDocfyRoutes equivalent
  this.route('docs', { path: '/docs' }, function() {
    this.route('page', { path: '/*path' });
  });
});
