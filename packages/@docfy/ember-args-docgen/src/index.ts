import path from 'path';
import fs from 'fs';
import glob from 'fast-glob';
import * as ts from 'typescript';
import Parser from './parser';
import { Options, Source, ArgumentItem, ComponentDoc } from './types';

const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'dist/**'
];

export default function DocGen(sources: Source[]): ComponentDoc[] {
  const components: ComponentDoc[] = [];

  sources.forEach((source) => {
    const filePaths: string[] = [];
    const result = glob.sync(source.pattern, {
      cwd: source.root,
      ignore: [...DEFAULT_IGNORE, ...(source.ignore || [])],
      absolute: true
    });
    filePaths.push(...result);

    let compilerOptions =
      (source.options || ({} as Options)).compilerOptions || {};

    if (source.options && source.options.tsconfigPath) {
      compilerOptions = getCompilerOptionsFromTSConfig(
        source.options.tsconfigPath,
        source.root
      );
    }

    const program = ts.createProgram(filePaths, compilerOptions);
    const checker = program.getTypeChecker();
    const parser = new Parser(checker);

    const maybeComponents: ts.ClassDeclaration[] = [];

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
                maybeComponents.push(stmt);
              }
            }
          }
        });
      });

    components.push(
      ...maybeComponents
        .filter(
          (declaration) => declaration.name && parser.isComponent(declaration)
        )
        .map((component) => parser.getComponentDoc(component))
        .map((component) => {
          return {
            ...component,
            args: sortArgs(component.args),
            fileName: component.fileName.replace(
              path.join(source.root, '/'),
              ''
            )
          };
        })
    );
  });

  return components;
}

function sortArgs(args: ArgumentItem[]): ArgumentItem[] {
  return args.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
}

function getCompilerOptionsFromTSConfig(
  tsconfigPath: string,
  sourceRoot: string
): ts.CompilerOptions {
  if (!path.isAbsolute(tsconfigPath)) {
    tsconfigPath = path.join(sourceRoot, tsconfigPath);
  }

  const basePath = path.dirname(tsconfigPath);
  const { config, error } = ts.readConfigFile(tsconfigPath, (filename) =>
    fs.readFileSync(filename, 'utf8')
  );

  if (error !== undefined) {
    const errorText = `Cannot load custom tsconfig.json from provided path: ${tsconfigPath}, with error code: ${error.code}, message: ${error.messageText}`;
    throw new Error(errorText);
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );

  if (errors && errors.length) {
    throw errors[0];
  }
  return options;
}
