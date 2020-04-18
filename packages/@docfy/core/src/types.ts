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

export interface Context {
  root: string;
  remark: Processor;
  pages: Page[];
}

interface SourceSettings {
  pattern: string;
  urlPrefix?: string;
  ignore?: string[];
}

export interface Options {
  root: string;
  sources: SourceSettings[];
  remarkPlugins?: Plugin[];
}
