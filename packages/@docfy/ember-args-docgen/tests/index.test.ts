import DocGen from '../src';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__');

describe('DocGen', () => {
  test('it should work', async () => {
    const result = DocGen([
      {
        root,
        pattern: '**/*.ts'
      }
    ]);
    expect(result).toMatchSnapshot();
  });
});
