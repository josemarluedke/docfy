import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { parseFenceMeta, type CodeBlockOptions } from './fence-meta.js';
import { getComponentImport } from '../import-map.js';
import { html } from './utils.js';
import type { Root as MdastRoot, RootContent as MdastContent } from 'mdast';
import type { Element, Root as HastRoot, RootContent as HastContent } from 'hast';
import type { PageContent } from '@docfy/core/lib/types.js';
import type { PluginData } from '../types.js';
import type { ContainerDirective } from 'mdast-util-directive';

interface RecordedBlock extends CodeBlockOptions {
  language?: string;
  code: string;
}

/**
 * Collects the raw text of a hast subtree.
 *
 * Written locally rather than pulling in `hast-util-to-string`: this is the
 * only place it is needed, and it keeps the dependency surface unchanged.
 */
function textOf(node: HastContent | Element): string {
  if (node.type === 'text') {
    return node.value;
  }

  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(textOf).join('');
  }

  return '';
}

function raw(value: string): HastContent {
  // `render-markdown` stringifies with `allowDangerousHtml`, so `raw` nodes
  // pass through verbatim — this is how DocfyLink and the demo wrappers work.
  return { type: 'raw', value } as unknown as HastContent;
}

/**
 * Escapes a value for interpolation into a double-quoted attribute inside a
 * raw node.
 *
 * Two hazards, both real: `parseFenceMeta` accepts `title='...'`, whose value
 * may contain a double quote and would otherwise close the attribute early;
 * and a title containing `{{` reaches the template as a mustache, because raw
 * nodes are invisible to the `escapeCurliesInCode` pass, which only descends
 * into `code` elements.
 */
function attrValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/\{\{/g, '\\{{');
}

function openingTag(block: RecordedBlock): string {
  const args: string[] = [];

  if (block.language) {
    args.push(`@language="${attrValue(block.language)}"`);
  }
  if (block.title) {
    args.push(`@title="${attrValue(block.title)}"`);
  }
  if (block.collapsible) {
    args.push('@collapsible={{true}}');
  }
  if (block.showLineNumbers) {
    args.push('@showLineNumbers={{true}}');
  }
  if (!block.copyable) {
    args.push('@copyable={{false}}');
  }

  return `<DocfyCodeBlock ${args.join(' ')}>`;
}

function collect(ast: MdastRoot, tabFences: WeakSet<object>): RecordedBlock[] {
  const blocks: RecordedBlock[] = [];

  visit(ast, 'code', node => {
    const options = parseFenceMeta(node.meta);

    // A fence inside a `:::code-tabs` group already has its `title=` used as
    // the tab's label (see `expandTabDirectives` below); emitting it again as
    // `@title` here would draw a second header bar underneath the tab
    // repeating the same text. The tab label is the only title such a fence
    // gets.
    if (tabFences.has(node)) {
      options.title = undefined;
    }

    blocks.push({
      ...options,
      language: node.lang ?? undefined,
      code: node.value,
    });
  });

  return blocks;
}

function rewrite(ast: HastRoot, blocks: RecordedBlock[]): boolean {
  const targets: { parent: { children: HastContent[] }; node: Element }[] = [];

  visit(ast, 'element', (node, _index, parent) => {
    if (node.tagName !== 'pre' || !parent) {
      return;
    }
    targets.push({ parent: parent as { children: HastContent[] }, node });
  });

  let wrapped = false;

  targets.forEach((target, index) => {
    const block = blocks[index];

    if (!block) {
      return;
    }

    // Guard against a rehype plugin having inserted or removed a `<pre>`,
    // which would shift every pairing after it. Leaving the block unwrapped is
    // better than labelling it with another block's title.
    if (textOf(target.node).trim() !== block.code.trim()) {
      return;
    }

    const at = target.parent.children.indexOf(target.node);

    if (at === -1) {
      return;
    }

    target.parent.children.splice(
      at,
      1,
      raw(openingTag(block)),
      target.node,
      raw('</DocfyCodeBlock>')
    );
    wrapped = true;
  });

  return wrapped;
}

const TABS_DIRECTIVE = 'code-tabs';

/**
 * Rewrites `:::code-tabs` containers into a DocfyCodeTabs invocation, one tab
 * per fence. The fences themselves are left in place: the hast pass wraps them
 * in DocfyCodeBlock afterwards, so a tabbed block keeps every other feature.
 */
function expandTabDirectives(ast: MdastRoot, tabFences: WeakSet<object>): boolean {
  const found: { parent: { children: MdastContent[] }; node: ContainerDirective }[] = [];

  visit(ast, 'containerDirective', (node, _index, parent) => {
    if (node.name !== TABS_DIRECTIVE || !parent) {
      return;
    }
    found.push({
      parent: parent as unknown as { children: MdastContent[] },
      node: node as ContainerDirective,
    });
  });

  found.forEach(({ parent, node }) => {
    const at = parent.children.indexOf(node as unknown as MdastContent);

    if (at === -1) {
      return;
    }

    const hasFence = node.children.some(child => child.type === 'code');

    if (!hasFence) {
      // No fences means no tabs, which means DocfyCodeTabs would have zero
      // tabs and zero panels to render. Leave the directive's content in
      // place unchanged rather than emitting a stray, empty wrapper.
      parent.children.splice(at, 1, ...(node.children as MdastContent[]));
      return;
    }

    const preamble: MdastContent[] = [];
    const tabs: MdastContent[] = [];

    node.children.forEach(child => {
      if (child.type !== 'code') {
        // Non-fence content inside a tab group belongs to no single tab (it
        // sits between two fences, not inside one), so it is treated as
        // preamble: hoisted out of the group entirely and emitted once,
        // before the tab UI, rather than placed inside DocfyCodeTabs but
        // outside every tabs.Tab — which would render unconditionally no
        // matter which tab is active.
        preamble.push(child as MdastContent);
        return;
      }

      // The label comes from author-controlled fence meta (`title=`) or the
      // fence's language, and is interpolated into a raw node's attribute —
      // invisible to the hast-stage `escapeCurliesInCode` pass — so it must be
      // escaped here the same way `openingTag()` escapes `@title`/`@language`.
      const label = attrValue(parseFenceMeta(child.meta).title ?? child.lang ?? 'code');

      // Marked so `collect()` (run right after this, on the same ast) knows
      // not to also emit this fence's `title=` as `@title` — the tab label
      // above already carries it.
      tabFences.add(child);

      tabs.push(
        html(`<tabs.Tab @label="${label}">`),
        child as MdastContent,
        html('</tabs.Tab>')
      );
    });

    const replacement: MdastContent[] = [
      ...preamble,
      html('<DocfyCodeTabs as |tabs|>'),
      ...tabs,
      html('</DocfyCodeTabs>'),
    ];

    parent.children.splice(at, 1, ...replacement);
  });

  return found.length > 0;
}

const RECORDED = new WeakMap<object, RecordedBlock[]>();
const USED_TABS = new WeakMap<object, boolean>();

export default plugin({
  runWithMdast(ctx): void {
    const record = (page: PageContent<MdastRoot>): void => {
      const tabFences = new WeakSet<object>();
      USED_TABS.set(page, expandTabDirectives(page.ast, tabFences));
      RECORDED.set(page, collect(page.ast, tabFences));
      page.demos?.forEach(record);
    };

    ctx.pages.forEach(record);
  },

  runWithHast(ctx): void {
    ctx.pages.forEach(page => {
      let wrapped = false;

      const apply = (target: PageContent<HastRoot>): void => {
        const blocks = RECORDED.get(target) ?? [];

        if (rewrite(target.ast, blocks)) {
          wrapped = true;
        }

        target.demos?.forEach(apply);
      };

      apply(page as unknown as PageContent<HastRoot>);

      if (!wrapped) {
        return;
      }

      const pluginData = page.pluginData as PluginData;
      pluginData.imports ??= [];

      if (!pluginData.imports.some(i => i.name === 'DocfyCodeBlock')) {
        pluginData.imports.push(getComponentImport('DocfyCodeBlock'));
      }

      if (
        USED_TABS.get(page) &&
        !pluginData.imports.some(i => i.name === 'DocfyCodeTabs')
      ) {
        pluginData.imports.push(getComponentImport('DocfyCodeTabs'));
      }
    });
  },
});
