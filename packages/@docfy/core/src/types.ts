import { Node } from 'unist';
import { Processor } from 'unified';

export interface Content {
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
  demos?: Content[];
}

export interface StructuredContent {
  pages: Content[];
  categories: {
    [key: string]: Content[];
  };
  packages: {
    [key: string]: StructuredContent;
  };
}

export interface Context {
  unified: Processor;
  contents: Content[];
}
