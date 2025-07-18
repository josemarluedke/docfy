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

export interface InlineComponent {
  name: string;
  type: 'template-only' | 'class-based' | 'const-template';
  template: string;
  script?: string;
  imports?: ImportStatement[];
}

export interface GJSMetadata {
  imports: ImportStatement[];
  inlineComponents: InlineComponent[];
  additionalContent: string;
  templateContent: string; // The main HTML/HBS content
}

// Legacy demo component format from ember package
export interface LegacyDemoComponent {
  name: {
    pascalCase: string;
    dashCase: string;
  };
  chunks: Array<{
    ext: string;
    code: string;
    type: string;
  }>;
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
  snippet: any; // AST node reference
}

export interface DemoComponent {
  name: DemoComponentName;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    ast: any; // AST node reference
    editUrl?: string;
  };
}

export interface PreviewTemplateComponent {
  name: string;
  template: string;
  ext: string; // File extension (hbs, gjs, gts, etc.)
  originalNode?: any; // Reference to AST node for replacement
}
