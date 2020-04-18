import { Node } from 'unist';
import { Processor, Plugin } from 'unified';

export interface Page {
  source: string;
  ast: Node;
  markdown: string;
  rendered: string;
  metadata: {
    title?: string;
    order?: number;
    package?: string;
    category?: string;
    url?: string;
  };
  demos?: Page[];
}

export interface StructuredContent {
  pages: Page[];
  categories: {
    [key: string]: Page[];
  };
  packages: {
    [key: string]: StructuredContent;
  };
}

export interface Context {
  remark: Processor;
  pages: Page[];
}

interface InputOptions {
  prefix: string;
  pattern: string;
  ignore?: string[];
}

export interface Options {
  root: string;
  input: InputOptions[];
  remarkPlugins?: Plugin[];
}
