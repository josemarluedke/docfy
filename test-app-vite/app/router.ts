import EmberRouter from '@ember/routing/router';
import config from 'test-app-vite/config/environment';
import { addDocfyRoutes } from '@docfy/ember';

interface Config {
  locationType: string;
  rootURL: string;
}

const typedConfig = config as Config;

export default class Router extends EmberRouter {
  location = typedConfig.locationType;
  rootURL = typedConfig.rootURL;
}

Router.map(function () {
  // Automatically add routes based on Docfy output
  addDocfyRoutes(this);
});
