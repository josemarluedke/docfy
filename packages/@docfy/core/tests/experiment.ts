// Directories
// root:
//   -> docs
//   -> app/componennts/*.md
//   -> app/componennts/**/demo/*.md
// project
//  docs
//    - install.md - whatever.md
//  packages/
//    forms/
//      docs/
//        - install.md
//        - styles.md
//      addon/components/*/
//        - name.md
//        demo/
//          - demo1.md
//          - demo2.md
// intro
// install
// compoennts
//   button
//   button Group
// modifers
//   on
//   bla
// package
//   intro
//   bla
//   components
//     bla
//     blaf
import Docfy from '../src';
import path from 'path';
import hbs from 'remark-hbs';

const projectRoot = '../tests/__fixtures__/monorepo/';
// const projectRoot = '../../../../../frontile/';
const root = path.resolve(__dirname, projectRoot);

(async function (): Promise<void> {
  const docs = await Docfy({
    root,
    sources: [
      {
        urlPrefix: 'docs',
        pattern: '{/**/docs/**/*.md,/**/**/*.md,/**/addon/**/*.md}',
        ignore: ['/packages/docs/**']
      }
    ],
    remarkPlugins: [hbs]
  });

  console.log(docs);
})();
