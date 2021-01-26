import { Context } from '../types';

export function renderMarkdown(context: Context): void {
  context.pages.forEach((page) => {
    page.rendered = context.remark.stringify(page.ast);
  });
}
