import type { PageContent } from '@docfy/core/lib/types';

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
export interface DemoComponentChunk {
  code: string;
  ext: string;
  type: string;
  snippet: any; // AST node reference
}

export interface DemoComponent {
  name: string;
  chunks: DemoComponentChunk[];
  description?: {
    title?: string;
    editUrl?: string;
    content?: string;
  };
}

export interface PreviewTemplateComponent {
  name: string;
  template: string;
  ext: string; // File extension (hbs, gjs, gts, etc.)
  originalNode?: any; // Reference to AST node for replacement
}