declare module 'broccoli-funnel' {
  import Plugin from 'broccoli-plugin';
  import { InputNode } from 'broccoli-node-api';

  interface Options {
    annotation?: string;
    srcDir?: string;
    destDir?: string;
    allowEmpty?: boolean;
    include?: (string | RegExp | ((arg0: string) => boolean))[];
    exclude?: (string | ((arg0: string) => boolean))[];
    files?: string[];
    getDestinationPath?(file: string): string;
  }

  export default class Funnel extends Plugin {
    constructor(inputNode: InputNode, options?: Options);
  }
}
