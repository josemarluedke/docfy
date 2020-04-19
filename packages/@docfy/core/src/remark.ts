import unified from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import slug from 'remark-slug';
import html from 'remark-html';
import stringify from 'remark-stringify';
import normalizeHeadings from 'remark-normalize-headings';
import { Processor, Plugin } from 'unified';

export function createRemark(plugins?: Plugin[]): Processor {
  const stack = unified()
    .use(parse)
    .use(normalizeHeadings)
    .use(slug)
    .use(stringify)
    .use(frontmatter, [{ type: 'yaml', marker: '-' }]);

  if (plugins && plugins.length > 0) {
    plugins.forEach((fn) => {
      stack.use(fn);
    });
  }

  return stack.use(html);
}
