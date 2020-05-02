declare module 'broccoli-source' {
  import { PluginOptions } from 'broccoli-plugin/dist/interfaces';
  import Plugin from 'broccoli-plugin';
  import { InputNode } from 'broccoli-node-api';

  export class UnwatchedDir extends Plugin {
    constructor(inputNode: InputNode, options?: PluginOptions);
  }
}
