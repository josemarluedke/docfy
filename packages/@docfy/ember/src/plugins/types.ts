import { Node } from 'unist';

interface Literal {
  value: string;
}

export interface CodeNode extends Node, Literal {
  type: 'code';
  lang?: string;
  meta?: string;
}

export interface DemoComponent {
  name: DemoComponentName;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    ast: Node;
    editUrl?: string;
  };
}

export interface DemoComponentName {
  dashCase: string;
  pascalCase: string;
}

export interface DemoComponentChunk {
  type: string;
  code: string;
  ext: string;
  snippet: Node;
}
