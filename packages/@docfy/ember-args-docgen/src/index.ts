// import glob from 'fast-glob';
import path from 'path';
import { Application } from 'typedoc';
import fs from 'fs';
import { ReferenceType } from 'typedoc/dist/lib/models';
import { getArgsType, isComponent } from './utils';

interface Bla {
  name: string;
  argsType: string;
}

export default function () {
  const outPath = path.join(__dirname, 'test-bla.json');
  const filePaths = [
    path.resolve(
      path.join(
        __dirname,
        '../../../../../frontile/packages/core/addon/components/close-button.ts'
      )
    )
  ];

  // Setup our TypeDoc app
  const app = new Application();
  // app.options.addReader(
  // new typedoc.TSConfigReader(
  // path.resolve(__dirname, '../packages/core/tsconfig.json')
  // )
  // );
  // console.log('YOOOOO ', ReflectionType);

  app.bootstrap({
    mode: 'file',
    // logger: 'none',
    // target: 'ES5',
    // module: 'CommonJS',
    ignoreCompilerErrors: true,
    experimentalDecorators: true,
    // excludeNotExported: true,
    excludePrivate: true,
    excludeExternals: true
  });

  // console.log(app.components);

  // Actually generate the JSON file
  const result = app.convert(filePaths);
  // app.generateJson(filePaths, outPath);
  //

  result?.children?.forEach((declaration) => {
    if (isComponent(declaration.extendedTypes?.[0])) {
      console.log(declaration.name);
      // const b = declaration.extendedTypes?.[0] as ReferenceType;
      getArgsType(declaration);
    }
    // console.log(isComponent(declaration.extendedTypes?.[0]));
    // if (i)

    // console.log(declaration.extendedTypes?.[0] as ReferenceType);
  });

  // Parse it
  // const json = JSON.parse(fs.readFileSync(outPath, 'utf8'));

  // const components: Bla[] = [
  // // { name, argsType }
  // ];

  // // json.forEach((item) => {
  // json.children.forEach((a) => {
  // if (a.extendedTypes) {
  // a.extendedTypes.forEach((b) => {
  // if (b.name === 'Component') {
  // console.log(a.extendedTypes);
  // console.log(a.name);
  // components.push({ name: a.name, argsType: b.typeArguments[0].name });
  // }
  // });
  // }
  // });

  // components.forEach((component) => {
  // const args = [];
  // const argsType = findByName(json, component.argsType);

  // argsType.children.forEach((item) => {
  // console.log({
  // name: item.name,
  // type: getType(item.type),
  // isOptional: item.flags.isOptional || false
  // });

  // // args.push({
  // // name: item.name,
  // // type: getType(item.type),
  // // isOptional: item.flags.isOptional || false
  // // });
  // });
  // console.log(args);

  // // component.args = args;
  // });

  // console.log(components);
}

function getType(input) {
  // let a = new ReflectionType(input);
  // console.log(a);

  if (input.type === 'intrinsic') {
    return input.name;
  } else {
    return 'TODO -> ' + input.type;
  }
}

function findByName(json, name) {
  let found;
  json.children.forEach((a) => {
    console.log(a.name, name);
    if (a.name === name) {
      found = a;
    }
  });
  return found;
}
