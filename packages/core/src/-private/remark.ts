import unified from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import extractFrontmatter from 'remark-extract-frontmatter';
import slug from 'remark-slug';
import normalizeHeadings from 'remark-normalize-headings';
import { Processor } from 'unified';
import { Options } from '../types';
import YAML from 'yaml';
import remark2rehype from 'remark-rehype';
import raw from 'rehype-raw';
import visit from 'unist-util-visit';

export function createRemark(
  remarkPlugins?: Options['remarkPlugins']
): Processor {
  const stack = unified()
    .use(parse)
    .use(frontmatter)
    .use(extractFrontmatter, { name: 'frontmatter', yaml: YAML.parse })
    .use(normalizeHeadings)
    .use(slug);

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
    // allowDangerousHTML: true
  });
  // .use(() => {
  // return (ast) => {
  // visit(ast, 'raw', (node) => {
  // console.log(node);
  // // node.type = 'raw';
  // });
  // };
  // });
  // .use(raw);

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
