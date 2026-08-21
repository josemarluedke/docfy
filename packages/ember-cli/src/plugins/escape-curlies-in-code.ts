import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import type { PageContent } from '@docfy/core/lib/types.js';

/**
 * Escapes `{{` inside code elements so that Ember's template compiler does not
 * try to parse them as mustaches.
 *
 * `remark-hbs` can do this too, but it works on the mdast tree — before rehype
 * plugins run. Modern syntax highlighters (`rehype-highlight`,
 * `rehype-prism-plus`, ...) are rehype plugins, so they split code into nested
 * `<span>` elements *after* remark-hbs has escaped anything, which reintroduces
 * bare `{{` into the output. Running at the hast stage (`runWithHast`, which
 * Docfy invokes after all rehype plugins) escapes the final text instead.
 */
function escapeCurliesInCode(ast: Root): void {
  visit(ast, 'element', node => {
    if (node.tagName !== 'code') {
      return;
    }

    visit(node, 'text', textNode => {
      textNode.value = textNode.value.replace(/\{\{/g, '\\{{');
    });

    // Do not descend again into nested code elements.
    return 'skip';
  });
}

export default plugin({
  runWithHast(ctx): void {
    const escape = (page: PageContent<Root>): void => {
      escapeCurliesInCode(page.ast);
      page.demos?.forEach(escape);
    };

    ctx.pages.forEach(escape);
  },
});
