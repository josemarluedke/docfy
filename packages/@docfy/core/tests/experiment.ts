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
import autolinkHeadings from 'remark-autolink-headings';

const projectRoot = '../tests/__fixtures__/monorepo/';
// const projectRoot = '../../../../../frontile/';
const root = path.resolve(__dirname, projectRoot);

(async function (): Promise<void> {
  const docfy = new Docfy({
    remarkPlugins: [[autolinkHeadings, { behavior: 'append' }], hbs]
  });

  const docs = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      urlSchema: 'manual',
      pattern: '{/**/docs/**/*.md,/**/*.md}',
      ignore: ['/packages/docs/**']
    }
  ]);

  console.log(docs);
})();
