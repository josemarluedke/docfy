import {
  getArgsForComponent,
  isComponent,
  Argument,
  getFileName
} from './utils';
import { Application } from 'typedoc';
import path from 'path';
import util from 'util';

function inspect(obj: unknown): void {
  console.log(util.inspect(obj, false, 15, true));
}

interface ComponentDefinition {
  name: string;
  fileName: string;
  args: Argument[];
}

export default function () {
  const filePaths = [
    path.resolve(
      path.join(
        __dirname,
        '../../../../../frontile/packages/core/addon/components/close-button.ts'
      )
    )
  ];

  const app = new Application();
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

  const result = app.convert(filePaths);
  const components: ComponentDefinition[] = [];

  result?.children?.forEach((declaration) => {
    if (isComponent(declaration.extendedTypes?.[0])) {
      components.push({
        name: declaration.name,
        fileName: getFileName(declaration.sources),
        args: getArgsForComponent(declaration)
      });
    }
  });

  inspect(components);
}
