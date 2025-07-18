import type { Node } from 'unist';

interface Literal {
  value: string;
}
export interface CodeNode extends Node, Literal {
  type: 'code';
  lang?: string;
  meta?: string;
}
export interface ImportStatement {
  type: 'component' | 'helper' | 'modifier' | 'service' | 'other';
  name: string;
  path: string;
  isDefault: boolean;
  namedImports?: string[];
}

// New demo component format matching original ember implementation
export interface DemoComponentName {
  dashCase: string;
  pascalCase: string;
}

export interface DemoComponentChunk {
  type: string;
  code: string;
  ext: string;
  snippet: Node; // AST node reference
}

export interface DemoComponent {
  name: DemoComponentName;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    ast: Node; // AST node reference
    editUrl?: string;
  };
}

