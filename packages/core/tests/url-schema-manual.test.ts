import Docfy from '../src';
import path from 'path';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('URLs should be correctly generated when urlSchema is set to manual', () => {
  test('base base, no url prefix, no suffix', async () => {
    const docfy = new Docfy();
    const result = await docfy.run([
      {
        root,
        urlSchema: 'manual',
        pattern: '**/*.md',
      },
    ]);

    const urls = [];
    result.content.forEach(page => {
      urls.push([page.source, page.meta.url]);
    });
    expect(urls).toMatchSnapshot();
  });

  test('when source defines url prefix and suffix', async () => {
    const docfy = new Docfy();
    const result = await docfy.run([
      {
        root,
        urlPrefix: 'docs',
        urlSchema: 'manual',
        urlSuffix: '.html',
        pattern: '**/*.md',
      },
    ]);

    const urls = [];
    result.content.forEach(page => {
      urls.push([page.source, page.meta.url]);
    });

    expect(urls).toMatchSnapshot();
  });
});
