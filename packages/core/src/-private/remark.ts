import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import extractFrontmatter from 'remark-extract-frontmatter';
import remarkNormalizeHeadings from 'remark-normalize-headings';
import remarkRehype from 'remark-rehype';
import YAML from 'yaml';
import { mdastSlug } from './mdast-slug.js';
import { Options, RehypeProcessor, RemarkProcessor } from '../types.js';

export function createRemark(remarkPlugins?: Options['remarkPlugins']): RemarkProcessor {
  const stack = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(extractFrontmatter, { name: 'frontmatter', yaml: YAML.parse })
    .use(remarkNormalizeHeadings)
    .use(mdastSlug)
    .use(remarkGfm);

  if (remarkPlugins && remarkPlugins.length > 0) {
    remarkPlugins.forEach(fn => {
      if (Array.isArray(fn)) {
        stack.use(...(fn as [never, never]));
      } else {
        stack.use(fn as never);
      }
    });
  }

  return stack as unknown as RemarkProcessor;
}

export function createRehype(rehypePlugins?: Options['rehypePlugins']): RehypeProcessor {
  const stack = unified().use(remarkRehype, {
    allowDangerousHtml: true,
  });

  if (rehypePlugins && rehypePlugins.length > 0) {
    rehypePlugins.forEach(fn => {
      if (Array.isArray(fn)) {
        stack.use(...(fn as [never, never]));
      } else {
        stack.use(fn as never);
      }
    });
  }

  return stack as unknown as RehypeProcessor;
}
