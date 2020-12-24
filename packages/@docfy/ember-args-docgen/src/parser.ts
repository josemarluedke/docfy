import * as ts from 'typescript';

interface DocComment {
  description: string;
  tags: Record<string, string>;
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

      return args.map((arg) => {
        const type = this.checker.getTypeOfSymbolAtLocation(arg, component);

        return {
          name: arg.getName(),
          type: this.getArgumentType(type),
          isRequired: this.isRequired(arg),
          ...this.findDocComment(arg)
        };
      });
    }

    return [];
  }

  getArgumentType(argumentType: ts.Type): ArgumentItemType {
    const typeAsString = this.checker.typeToString(argumentType);

    if (argumentType.isUnion() && typeAsString !== 'boolean') {
      return {
        name: 'enum',
        raw: typeAsString,
        options: argumentType.types.map((type) =>
          this.getValuesFromUnionType(type)
        )
      };
    }

    return { name: typeAsString };
  }

  getValuesFromUnionType(type: ts.Type): string {
    if (type.isStringLiteral()) return `'${type.value}'`;
    if (type.isNumberLiteral()) return `${type.value}`;
    return this.checker.typeToString(type);
  }

  isRequired(symbol: ts.Symbol): boolean {
    const isOptional = (symbol.getFlags() & ts.SymbolFlags.Optional) !== 0;

    const hasQuestionToken = symbol.declarations.every((d) => {
      if (ts.isPropertySignature(d) || ts.isPropertyDeclaration(d)) {
        return d.questionToken;
      }
      return false;
    });

    return !isOptional && !hasQuestionToken;
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
