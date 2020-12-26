import DocGen from '../src';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__');

describe('DocGen', () => {
  test('it should work for TypeScript files', async () => {
    const result = DocGen([
      {
        root,
        pattern: '**/*.ts'
      }
    ]);
    expect(result).toMatchSnapshot();
  });

  test('it should work for JavaScript files when using allowJS', async () => {
    const result = DocGen([
      {
        root,
        pattern: '**/*.js',
        options: {
          compilerOptions: {
            allowJs: true
          }
        }
      }
    ]);
    expect(result).toMatchSnapshot();
  });
});
