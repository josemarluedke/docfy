import { Context } from '../types';
// import stringify from 'rehype-stringify';
// import remark2rehype from 'remark-rehype';
import rehype2remark from 'rehype-remark';
import stringify from 'remark-stringify';
import html from 'remark-html';

export function renderMarkdown(context: Context): void {
  context.pages.forEach((page) => {
    const remark = context.remark().use(rehype2remark).use(stringify).use(html);
    page.rendered = remark.stringify(page.ast);
  });
}
