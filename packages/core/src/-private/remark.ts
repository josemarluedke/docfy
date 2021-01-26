import unified from 'unified';
import parse from 'remark-parse';
import parseFrontmatter from 'remark-parse-yaml';
import frontmatter from 'remark-frontmatter';
import slug from 'remark-slug';
import html from 'remark-html';
import stringify from 'rehype-stringify';
import remark2rehype from 'remark-rehype';
// import stringify from 'remark-stringify';
// import rehype2remark from 'rehype-remark';
import normalizeHeadings from 'remark-normalize-headings';
import { Processor } from 'unified';
import { Options } from '../types';

export function createRemark(
  remarkPlugins?: Options['remarkPlugins'],
  rehypePlugins?: Options['rehypePlugins']
): Processor {
  const stack = unified()
    .use(parse)
    .use(frontmatter)
    .use(parseFrontmatter)
    .use(normalizeHeadings)
    .use(slug);

  const plugins: Options['rehypePlugins'] = [];

  if (remarkPlugins && remarkPlugins.length > 0) {
    plugins.push(...remarkPlugins);
  }
  if (rehypePlugins && rehypePlugins.length > 0) {
    plugins.push(...rehypePlugins);
  }

  plugins.forEach((fn) => {
    if (Array.isArray(fn)) {
      stack.use(...fn);
    } else {
      stack.use(fn);
    }
  });

  return stack.use(remark2rehype).use(stringify);
  // .use(html);
}
