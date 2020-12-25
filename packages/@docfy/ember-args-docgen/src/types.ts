import * as ts from 'typescript';

export interface Options {
  tsconfigPath?: string;

  /**
   * TypeScript CompilerOptions
   * CompilerOptions are ignored if tsconfigPath is defined
   */
  compilerOptions?: ts.CompilerOptions;
}

export interface Source {
  /**
   * The absolute path to where the files are located.
   */
  root: string;

  /**
   * Match files using the patterns the shell uses, like stars and stuff. It
   * uses Glob package.
   */
  pattern: string;

  /**
   * Pattern to ignore.
   */
  ignore?: string[];

  /**
   * The options
   */
  options?: Options;
}

export interface DocumentationTag {
  name: string;
  value: string;
}

export interface DocumentationComment {
  description: string;
  tags: Record<string, DocumentationTag>;
}

export interface ArgumentItem {
  name: string;
  type: ArgumentItemType;
  isRequired: boolean;
  defaultValue?: string;
}

export interface ArgumentItemType {
  name: string;
  raw?: string;
  options?: string[];
}

export interface ComponentDoc extends DocumentationComment {
  name: string;
  fileName: string;
  args: ArgumentItem[];
}
