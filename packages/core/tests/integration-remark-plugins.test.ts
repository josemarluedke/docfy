import Docfy from '../src';
import { DocfyResult } from '../src/types';
import path from 'path';
import autolinkHeadings from 'remark-autolink-headings';
import math from 'remark-math';
import katex from 'rehype-katex';

const root = path.resolve(__dirname, './__fixtures__/monorepo');

describe('When proving remark plugins', () => {
  describe('When plugin has no options', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy({
        remarkPlugins: [autolinkHeadings],
      });
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          urlSchema: 'manual',
          pattern: '**/*.md',
        },
      ]);
    });

    test('it should have rendered the content with the plugin with no options', () => {
      const htmls = [];
      result.content.forEach(page => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });

  describe('When plugin has options', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy({
        remarkPlugins: [[autolinkHeadings, { behavior: 'append' }]],
      });
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          urlSchema: 'manual',
          pattern: '**/*.md',
        },
      ]);
    });

    test('it should have rendered the content with the plugin and their options', () => {
      const htmls = [];
      result.content.forEach(page => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });

  describe('Using remark math plugin', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy({
        remarkPlugins: [math],
      });
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          pattern: '**/math.md',
        },
      ]);
    });

    test('it should have used the remark math plugin', () => {
      const htmls = [];
      result.content.forEach(page => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });
});

describe('When proving rehype plugins', () => {
  describe('When plugin has no options', () => {
    let result: DocfyResult;

    beforeAll(async () => {
      const docfy = new Docfy({
        remarkPlugins: [math],
        rehypePlugins: [katex],
      });
      result = await docfy.run([
        {
          root,
          urlPrefix: 'docs',
          pattern: '**/math.md',
        },
      ]);
    });

    test('it should have used remark and rehype plugins', () => {
      const htmls = [];
      result.content.forEach(page => {
        htmls.push([page.source, page.rendered]);
      });

      expect(htmls).toMatchSnapshot();
    });
  });
});
