declare module 'broccoli-bridge' {
  import Plugin from 'broccoli-plugin';
  import { InputNode, Node } from 'broccoli-node-api';

  export default class Funnel extends Plugin {
    constructor();

    placeholderFor(name: string): InputNode;
    fulfill(name: string, tree: Node): void;
  }
}
