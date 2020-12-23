import {
  Type,
  ReferenceType,
  Comment,
  SourceReference,
  DeclarationReflection
} from 'typedoc/dist/lib/models';

export interface Argument {
  name: string;
  type: string;
  isRequired: boolean;
  description?: string;
  defaultValue?: string;
}
export function isComponent(type?: Type): type is ReferenceType {
  if (type && type.type === 'reference') {
    return (type as ReferenceType).name == 'Component';
  }

  return false;
}

export function isReferenceType(type?: Type): type is ReferenceType {
  return Boolean(type && type.type === 'reference');
}

function getDefaultValue(comment?: Comment): string | undefined {
  let defaultValue: string | undefined;

  if (comment) {
    comment.tags?.forEach((tag) => {
      if (tag.tagName == 'defaultvalue') {
        defaultValue = tag.text.replace(/\n/, '');
        return;
      }
    });
  }
  return defaultValue;
}

export function getArgsForComponent(dec: DeclarationReflection): Argument[] {
  const result: Argument[] = [];
  const reference = dec.extendedTypes?.[0];

  if (isComponent(reference)) {
    const firstArg = reference.typeArguments?.[0];

    if (isReferenceType(firstArg)) {
      const args =
        (firstArg.reflection as DeclarationReflection | undefined)?.children ||
        [];

      args.forEach((arg) => {
        result.push({
          name: arg.name,
          type: arg.type?.toString() || '',
          isRequired: arg.flags.isOptional != true,
          description: arg.comment?.shortText,
          defaultValue: getDefaultValue(arg.comment)
        });
      });
    }
  }

  return sortArgs(result);
}

function sortArgs(args: Argument[]): Argument[] {
  return args.sort((a, b) => {
    const aRequired = a.isRequired ? 1000 : 0;
    const bRequired = b.isRequired ? 1000 : 0;
    const requiredOffset = aRequired - bRequired;
    return String(a.name).localeCompare(b.name) - requiredOffset;
  });
}

export function getFileName(source: undefined | SourceReference[]): string {
  if (source && source.length > 0) {
    return source[0].fileName;
  }
  return '';
}
