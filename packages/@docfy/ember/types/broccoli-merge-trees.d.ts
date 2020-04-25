declare module 'broccoli-merge-trees' {
  import Plugin from 'broccoli-plugin';
  import { InputNode } from 'broccoli-node-api';
  import { PluginOptions } from 'broccoli-plugin/dist/interfaces';

  interface Options extends PluginOptions {
    overwrite?: boolean;
  }

  export default class MergeTrees extends Plugin {
    constructor(inputNodes: InputNode[], options?: Options);
  }
}
