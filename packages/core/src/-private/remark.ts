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

export function createRemark(
  remarkPlugins?: Options['remarkPlugins'],
  rehypePlugins?: Options['rehypePlugins']
): Processor {
  const stack = unified()
    .use(parse)
    .use(frontmatter)
    .use(extractFrontmatter, { name: 'frontmatter', yaml: YAML.parse })
    .use(normalizeHeadings)
    .use(slug);

  const plugins: Options['rehypePlugins'] = [];

  if (remarkPlugins && remarkPlugins.length > 0) {
    plugins.push(...remarkPlugins);
  }

  // stack.use(remark2rehype);

  if (rehypePlugins && rehypePlugins.length > 0) {
    console.log('HAS rehypePlugins', ...rehypePlugins);
    plugins.push(...rehypePlugins);
  }

  plugins.forEach((fn) => {
    if (Array.isArray(fn)) {
      stack.use(...fn);
    } else {
      stack.use(fn);
    }
  });

  return stack;
}
