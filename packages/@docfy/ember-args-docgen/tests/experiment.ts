import docgen from '../src';
import path from 'path';

(async function (): Promise<void> {
  docgen([
    // {
    // root: path.resolve(
    // path.join(__dirname, '../../../../../frontile/packages/core/addon')
    // ),
    // pattern: 'components/**/*.ts'
    // }
    {
      root: path.resolve(
        path.join(__dirname, '../../../../../frontile/packages/overlays/addon')
      ),
      pattern: 'components/**/*.ts'
    }
  ]);
})();
