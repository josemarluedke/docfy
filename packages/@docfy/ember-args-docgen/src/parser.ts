import * as ts from 'typescript';

interface DocComment {
  description: string;
  tags: Record<string, string>;
}

export interface ArgumentItem {
  name: string;
  type: string;
  isRequired: boolean;
  defaultValue?: string;
}

interface ComponentDoc extends DocComment {
  name: string;
  fileName: string;
  args: ArgumentItem[];
}

export default class Parser {
  checker: ts.TypeChecker;

  constructor(checker: ts.TypeChecker) {
    this.checker = checker;
  }

  getComponentDoc(component: ts.ClassDeclaration): ComponentDoc {
    const type = this.checker.getTypeAtLocation(component);
    const output: ComponentDoc = {
      name: component.name?.getText() || 'Component',
      fileName: component.getSourceFile().fileName,
      args: this.getComponentArgs(component),
      ...this.findDocComment(type.symbol)
    };

    return output;
  }

  getComponentArgs(component: ts.ClassDeclaration): ArgumentItem[] {
    const componentType = this.checker.getTypeAtLocation(component);
    const argsProperty = componentType.getProperty('args');

    if (argsProperty) {
      const args = this.checker
        .getTypeOfSymbolAtLocation(argsProperty, component)
        .getApparentProperties();

      args.forEach((arg) => {
        // console.log(arg.escapedName);
        // const doc = this.findDocComment(arg);
        // console.log(doc);
        // const declaration = arg.valueDeclaration || arg.declarations[0];
        // if (declaration) {
        // console.log(declaration);
        // }
        // const c = checker.getTypeOfSymbolAtLocation(arg, item);
        // console.log(c);
      });
    }

    return [];
  }

  isComponent(item: ts.HeritageClause | undefined): boolean {
    if (!item) {
      return false;
    }
    const type = item.types[0];
    const symbol = this.checker.getSymbolAtLocation(type.expression);
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
  }

  findDocComment(symbol: ts.Symbol): DocComment {
    let mainComment = ts.displayPartsToString(
      symbol.getDocumentationComment(this.checker)
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
  }
}
