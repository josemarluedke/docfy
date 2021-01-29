import {
  Plugin,
  PluginOptions,
  PluginWithOptions,
  PluginWithOptionsFunction
} from './types';

function plugin(handlers: Plugin): Plugin {
  return handlers;
}

function pluginWithOptions<T = PluginOptions>(
  handlers: Plugin<T>
): PluginWithOptionsFunction<T> {
  function optionsFunction(options?: T): PluginWithOptions<T> {
    return {
      __options: options,
      ...handlers
    };
  }
  optionsFunction.__isOptionsFunction = true;

  return optionsFunction;
}

plugin.withOptions = pluginWithOptions;

export default plugin;
