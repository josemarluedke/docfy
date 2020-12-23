import { Argument } from './utils';
import glob from 'fast-glob';
import util from 'util';
import * as ts from 'typescript';

function inspect(obj: unknown): void {
  console.log(util.inspect(obj, false, 15, true));
}

const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'dist/**'
];

interface ComponentDefinition {
  name: string;
  fileName: string;
  args: Argument[];
}

interface DocComment {
  description: string;
  tags: Record<string, string>;
}

const defaultDocComment: DocComment = {
  description: '',
  tags: {}
};

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

function formatTag(tag: ts.JSDocTagInfo) {
  let result = '@' + tag.name;
  if (tag.text) {
    result += ' ' + tag.text;
  }
  return result;
}

export default function (sources: Source[]) {
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
  console.log(filePaths);

  const program = ts.createProgram(filePaths, {
    // module: ts.ModuleKind.CommonJS,
    // target: ts.ScriptTarget.Latest
  });

  const checker = program.getTypeChecker();

  const isComponent = (item: ts.HeritageClause | undefined): boolean => {
    if (!item) {
      return false;
    }
    const type = item.types[0];
    const symbol = checker.getSymbolAtLocation(type.expression);
    const declaration = symbol?.declarations[0];
    if (!declaration) {
      return false;
    }

    if (ts.isImportClause(declaration)) {
      return !!declaration.parent.moduleSpecifier
        .getText()
        .match(/@glimmer\/component/);
    }

    return false;
  };

  const possibleComponents: ts.ClassDeclaration[] = [];

  filePaths
    .map((filePath) => program.getSourceFile(filePath))
    .filter(
      (sourceFile): sourceFile is ts.SourceFile =>
        typeof sourceFile !== 'undefined'
    )
    .forEach((sourceFile) => {
      sourceFile.statements.forEach((stmt) => {
        if (ts.isClassDeclaration(stmt)) {
          possibleComponents.push(stmt);
        }
      });
    });

  const components: ComponentDefinition[] = [];

  const findDocComment = (symbol: ts.Symbol): DocComment => {
    let mainComment = ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    );

    if (mainComment) {
      mainComment = mainComment.replace('\r\n', '\n');
    }

    const tags = symbol.getJsDocTags() || [];
    const tagMap: Record<string, string> = {};

    tags.forEach((tag) => {
      const trimmedText = (tag.text || '').trim();
      const currentValue = tagMap[tag.name];
      tagMap[tag.name] = currentValue
        ? currentValue + '\n' + trimmedText
        : trimmedText;
    });

    return {
      description: mainComment,
      tags: tagMap
    };
  };

  possibleComponents.forEach((item) => {
    if (!item.name) {
      return;
    }

    if (!isComponent(item.heritageClauses?.[0])) {
      return;
    }

    const component: ComponentDefinition = {
      name: item.name.getText(),
      fileName: item.getSourceFile().fileName,
      args: []
    };

    const itemType = checker.getTypeAtLocation(item);
    const argsProperty = itemType.getProperty('args');

    if (argsProperty) {
      const args = checker
        .getTypeOfSymbolAtLocation(argsProperty, item)
        .getApparentProperties();

      args.forEach((arg) => {
        console.log(arg.escapedName);
        const doc = findDocComment(arg);
        console.log(doc);

        // const declaration = arg.valueDeclaration || arg.declarations[0];
        // if (declaration) {
        // console.log(declaration);
        // }

        // const c = checker.getTypeOfSymbolAtLocation(arg, item);
        // console.log(c);
      });
    }

    components.push(component);
  });

  inspect(components);
}
