import {
  getArgsForComponent,
  isComponent,
  Argument,
  getFileName
} from './utils';
import glob from 'fast-glob';
import { Application } from 'typedoc';
import util from 'util';

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
