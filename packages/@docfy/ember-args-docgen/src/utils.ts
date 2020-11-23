// TODO generate nice formatting for function args eg: function -> (event: Event) => void
//
//

interface Argument {
  name: string;
  type: string;
  isRequired: boolean;
  description?: string;
  defaultValue?: string;
}

import {
  Type,
  ReferenceType,
  DeclarationReflection,
  Comment
} from 'typedoc/dist/lib/models';

export function isComponent(type?: Type): type is ReferenceType {
  if (type && type.type === 'reference') {
    return (type as ReferenceType).name == 'Component';
  }

  return false;
}

export function isReferenceType(type?: Type): type is ReferenceType {
  return Boolean(type && type.type === 'reference');
}

export function getArgsTypeB(reference: ReferenceType): string {
  const firstArg = reference.typeArguments?.[0];
  const result: Argument[] = [];

  if (isReferenceType(firstArg)) {
    console.log('bbbb ', firstArg.reflection?.name);
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
  console.log(result);

  return '';
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

export function getArgsType(dec: DeclarationReflection): void {
  const extendedFrom = dec.extendedTypes?.[0];

  if (isComponent(extendedFrom)) {
    const bla = getArgsTypeB(extendedFrom);
  }

  // const bla = reference.typeArguments?.[0];

  // console.log(bla);
}
