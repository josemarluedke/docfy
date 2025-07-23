import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app-vite/config/environment';
import './styles/tw.css';

interface Config {
  modulePrefix: string;
  podModulePrefix?: string;
  environment: string;
  rootURL: string;
  locationType: string;
  EmberENV: Record<string, unknown>;
  APP: Record<string, unknown>;
}

const typedConfig = config as Config;

export default class App extends Application {
  modulePrefix = typedConfig.modulePrefix;
  podModulePrefix = typedConfig.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, typedConfig.modulePrefix, compatModules);
