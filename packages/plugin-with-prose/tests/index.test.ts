import Docfy from '@docfy/core';
import path from 'path';
import withProse from '../src';

const root = path.resolve(__dirname, './__fixtures__');

test('it should work', async () => {
  const docfy = new Docfy({
    plugins: [withProse],
  });
  const result = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      pattern: '**/*.md',
    },
  ]);

  const htmls = [];
  result.content.forEach(page => {
    htmls.push([page.source, page.rendered]);

    page.demos?.forEach(demo => {
      htmls.push([demo.source, demo.rendered]);
    });
  });

  expect(htmls).toMatchSnapshot();
});

test('it should use custom class', async () => {
  const docfy = new Docfy({
    plugins: [withProse({ className: 'prose dark:prose-invert' })],
  });
  const result = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      pattern: '**/*.md',
    },
  ]);

  const htmls = [];
  result.content.forEach(page => {
    htmls.push([page.source, page.rendered]);

    page.demos?.forEach(demo => {
      htmls.push([demo.source, demo.rendered]);
    });
  });

  expect(htmls).toMatchSnapshot();
});
