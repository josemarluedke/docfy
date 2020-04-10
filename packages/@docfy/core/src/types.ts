import { Node } from 'unist';

export interface Content {
  filepath: string;
  ast: Node;
  rendered: string;
  metadata: {
    title?: string;
    order?: number;
    package?: string;
    category?: string;
    routePath?: string;
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
