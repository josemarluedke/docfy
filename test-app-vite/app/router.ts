import EmberRouter from '@ember/routing/router';
import config from 'test-app-vite/config/environment';
import { addDocfyRoutes } from './utils/docfy-routes';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Automatically add routes based on Docfy output
  addDocfyRoutes(this);
  
  // Additional routes
  this.route('test-virtual');
});
