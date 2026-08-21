import type { Code, Root } from 'mdast';

export type CodeNode = Code;

export interface ImportStatement {
  name: string;
  path: string;
  isDefault?: boolean;
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
  snippet: Code; // AST node reference
}

export interface DemoComponent {
  name: DemoComponentName;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    ast: Root; // AST node reference
    editUrl?: string;
  };
}

export interface FileToGenerate {
  path: string;
  content: string;
}

// Plugin data types
export interface PluginData {
  imports?: ImportStatement[];
  demoComponents?: DemoComponent[];
}
