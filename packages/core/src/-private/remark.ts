import unified from 'unified';
import parse from 'remark-parse';
import gfm from 'remark-gfm';
import frontmatter from 'remark-frontmatter';
import extractFrontmatter from 'remark-extract-frontmatter';
import slug from 'remark-slug';
import normalizeHeadings from 'remark-normalize-headings';
import { Processor } from 'unified';
import { Options } from '../types';
import YAML from 'yaml';
import remark2rehype from 'remark-rehype';

export function createRemark(
  remarkPlugins?: Options['remarkPlugins']
): Processor {
  const stack = unified()
    .use(parse)
    .use(frontmatter)
    .use(extractFrontmatter, { name: 'frontmatter', yaml: YAML.parse })
    .use(normalizeHeadings)
    .use(slug)
    .use(gfm);

  if (remarkPlugins && remarkPlugins.length > 0) {
    remarkPlugins.forEach((fn) => {
      if (Array.isArray(fn)) {
        stack.use(...fn);
      } else {
        stack.use(fn);
      }
    });
  }

  return stack;
}

export function createRehype(
  rehypePlugins?: Options['rehypePlugins']
): Processor {
  const stack = unified().use(remark2rehype, {
    allowDangerousHtml: true
  });

  if (rehypePlugins && rehypePlugins.length > 0) {
    rehypePlugins.forEach((fn) => {
      if (Array.isArray(fn)) {
        stack.use(...fn);
      } else {
        stack.use(fn);
      }
    });
  }

  return stack;
}
