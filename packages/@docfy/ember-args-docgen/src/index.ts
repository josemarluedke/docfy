import glob from 'fast-glob';
import * as ts from 'typescript';
import Parser, { ComponentDoc } from './parser';

const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'dist/**'
];

interface Source {
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
}

export default function (sources: Source[]): ComponentDoc[] {
  const filePaths: string[] = [];

  sources.forEach((item) => {
    console.log(item.root);
    const result = glob.sync(item.pattern, {
      cwd: item.root,

      ignore: [...DEFAULT_IGNORE, ...(item.ignore || [])],
      absolute: true
    });
    filePaths.push(...result);
  });

  const program = ts.createProgram(filePaths, {});

  const checker = program.getTypeChecker();
  const parser = new Parser(checker);

  const possibleComponents: ts.ClassDeclaration[] = [];

  filePaths
    .map((filePath) => program.getSourceFile(filePath))
    .filter(
      (sourceFile): sourceFile is ts.SourceFile =>
        typeof sourceFile !== 'undefined'
    )
    .forEach((sourceFile) => {
      // use class declarations that are exported
      sourceFile.statements.forEach((stmt) => {
        if (ts.isClassDeclaration(stmt)) {
          if (stmt.modifiers) {
            const exportModifiers = stmt.modifiers.filter(
              (m) => m.kind == ts.SyntaxKind.ExportKeyword
            );
            if (exportModifiers.length > 0) {
              possibleComponents.push(stmt);
            }
          }
        }
      });
    });

  return possibleComponents
    .filter(
      (declaration) => declaration.name && parser.isComponent(declaration)
    )
    .map((component) => parser.getComponentDoc(component));
}
