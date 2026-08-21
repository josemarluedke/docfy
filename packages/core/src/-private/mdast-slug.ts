import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * Adds `data.id` and `data.hProperties.id` to every heading in the mdast tree.
 *
 * This replaces the deprecated `remark-slug` package. We keep this at the mdast
 * level (rather than using `rehype-slug`) because Docfy's `toc` plugin reads
 * `node.data.id` while still working with markdown, before the tree is
 * transformed to hast.
 */
export function mdastSlug() {
  return function (tree: Root): void {
    const slugger = new GithubSlugger();

    visit(tree, 'heading', node => {
      const data = (node.data || (node.data = {})) as Record<string, unknown>;
      const props = (data.hProperties || (data.hProperties = {})) as Record<string, unknown>;

      const id = typeof data.id === 'string' ? data.id : slugger.slug(toString(node));

      data.id = id;
      props.id = id;
    });
  };
}
