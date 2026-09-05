# Code Block Features — Design

Date: 2026-09-05
Status: Approved, ready for implementation planning

## Problem

Docfy renders fenced code blocks as bare `<pre><code>` HTML. There is no code
block component in `@docfy/ember` at all, and no interaction: no copy button, no
way to collapse a long snippet, no way to call attention to specific lines, and
no way to group alternatives (npm/pnpm/yarn/bun) into tabs.

Syntax highlighting is entirely delegated to the consumer through
`rehypePlugins`. Both `test-app-vite` and the frontile site independently
configure `rehype-highlight` (highlight.js/lowlight) plus `highlightjs-glimmer`,
including a hand-written `glimmerTypescript` grammar wrapper in frontile. The
output is visibly coarser than what modern documentation sites produce, and each
consumer repeats the same non-obvious setup.

The reference for the target experience is
[shadcn-ember](https://github.com/IgnaceMaes/shadcn-ember). It does not use
Docfy: it highlights at runtime with `ember-shiki` and its authors hand-write
`code-block-themed.gts`, `code-collapsible-wrapper.gts` and `code-tabs.gts`
wrappers per instance. We want the same capabilities, but driven from markdown
and shared across every Docfy consumer.

## Goals

- Copy-to-clipboard on every code block.
- Per-instance collapse/expand for long blocks.
- Line highlighting drivable from the fence.
- Optional title/filename header and line numbers.
- Tabbed groups of related code blocks.
- Better syntax highlighting, shared rather than reconfigured per consumer.
- Demo snippets gain all of the above without a parallel implementation.

## Non-goals

- Runtime highlighting. Highlighting stays a build-time concern.
- Making Docfy opinionated about themes or colors by default.
- Automatic package-manager command translation (a `sh` fence that derives its
  own pnpm/yarn/bun variants). The tabs directive covers the case explicitly;
  auto-derivation is guesswork beyond `install`/`dlx` and is deferred.
- Comment-based line markers (`// [!code highlight]`) and diff notation.
- `@docfy/ember-cli` (classic/broccoli) support. Classic apps keep rendering
  bare `<pre>`. This is a documented feature gap, not an oversight.
- Runtime highlighting via `ember-shiki`. See "Why not ember-shiki" below.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Where highlighting runs | Build time, Shiki | Same VS Code grammars/themes that produce the reference quality. Zero runtime JS, dual themes via CSS variables, fits Docfy's existing hast stage. |
| Who owns the chrome | `@docfy/ember`, shared | One component serves standalone fences and demo snippets alike. BEM classes matching the existing `docfy-demo`, no Tailwind, no frontile dependency. |
| Authoring syntax | Fence meta string | The Shiki/rehype-pretty-code/Nextra/Astro convention. Familiar, copy-pasteable, and degrades to valid markdown on GitHub. |
| Tab groups | `:::code-tabs` container directive | General purpose (package managers, template-vs-component-vs-styles), not just one hardcoded case. |
| Shiki wiring | Opt-in preset package | Consumers stay in control of their pipeline, but nobody re-derives the gjs/gts and transformer setup. Follows the `@docfy/plugin-with-prose` precedent. |
| Build paths | `@docfy/ember-vite` only | The classic/broccoli path is explicitly out of scope. With one consumer, a `@docfy/core` seam would be speculative, and the rewrite emits Ember component invocations so it is not framework-agnostic regardless. |

## Architecture

### Pipeline: a new `code-blocks` plugin in `@docfy/ember-vite`

Lives in `packages/ember-vite/src/docfy-plugins/`, alongside its siblings
`escape-curlies-in-code` and `docfy-link-conversion`, both of which are likewise
Ember-specific hast/mdast transforms.

Two passes, because the information needed lives at two different stages.

**mdast pass.** Walk every page and demo AST, collect each `code` node in
document order, parse its `meta` string into options, and record the ordered
list on `page.pluginData.codeBlocks`. Fence meta exists only on mdast, which is
why parsing cannot wait.

**hast pass (`runWithHast`).** Runs after all rehype plugins, therefore after
whatever highlighter the consumer configured. Walk `<pre>` elements in document
order and zip them against the recorded list, then replace each `<pre>` with a
component invocation wrapping the original element:

```
<DocfyCodeBlock @language="gts" @title="components/ui/tabs.gts" @collapsible={{true}}>
  <pre class="shiki">…</pre>
</DocfyCodeBlock>
```

Order-zipping is deliberate rather than reading data attributes off the `<code>`
element: `@shikijs/rehype` rebuilds the entire `<pre>`/`<code>` subtree and does
not reliably carry `hProperties` through. The zip validates each pairing by
comparing text content; on a mismatch the block is left unwrapped rather than
mislabeled.

Ordering constraint: this plugin must run **before** the existing
`escape-curlies-in-code` pass, which continues to work unchanged.

### Copy reads from the DOM, not from an argument

The copy button calls `navigator.clipboard.writeText(preEl.textContent)` at
click time rather than receiving the source as a component argument. This avoids
escaping newlines, quotes and backslashes into an hbs string literal, avoids
doubling the payload in every generated template, and reads back correctly
because `\{{` in a compiled template renders as a literal `{{`.

### Line highlighting is Shiki's job, not Docfy's

Shiki's `transformerMetaHighlight` already parses `{4,9-12}` out of the fence
meta and marks the corresponding `<span class="line" data-highlighted>`. Docfy
ships the CSS for that markup and documents it; it does not reimplement range
parsing. The Docfy plugin consumes only the meta tokens Shiki ignores: `title`,
`collapsible`, `showLineNumbers`.

Consequence: when no highlighter is configured, blocks still get wrapped and
still get copy/collapse/title, but line highlighting and line numbers are inert.
This is acceptable and must be stated in the docs.

### Build path wiring

`@docfy/ember-vite` registers the plugin, adds `DocfyCodeBlock` and
`DocfyCodeTabs` to `IMPORT_MAP`, and pushes them into `pluginData.imports` when
used — the same mechanism `docfy-link-conversion` already uses.

`remark-directive` becomes a dependency of `@docfy/ember-vite` rather than
`@docfy/core`, so the `:::` parsing change is scoped to the vite integration.

## Why not ember-shiki

[`ember-shiki`](https://github.com/IgnaceMaes/ember-shiki) already ships
`CodeBlock`, `CodeGroup`/`CodeTab`, `CopyButton`, line numbers, line
highlighting, block naming, CSS-variable theming, lazy loading and FastBoot
support — most of this feature list. It is not adopted because:

1. **It highlights at runtime.** Docfy's pipeline produces HTML; ember-shiki
   consumes a source string. Adopting it means embedding raw source into every
   generated template, reintroducing the escaping and payload problems that
   reading `textContent` from the DOM avoids.
2. **It inverts the agnosticism.** Here `@docfy/ember` depends on no highlighter
   at all, and shiki is quarantined in an opt-in preset. Depending on
   ember-shiki pushes shiki into the component layer, the one place a consumer
   cannot opt out of it.
3. **It has no collapse/expand**, one of the four requested features.

The cost is re-implementing a copy button and a tab strip. Both are small, and
the tab strip is needed regardless because `docfy-demo` already has one that
should be shared.

Consumers who want runtime highlighting can still use ember-shiki directly; the
two are not mutually exclusive. This belongs in the docs.

## Authoring surface

### Fence meta

    ```gts title="components/ui/tabs.gts" {4,9-12} showLineNumbers collapsible

| Token | Effect |
| --- | --- |
| `title="…"` | Header bar showing the filename |
| `{4,9-12}` | Highlighted lines (handled by Shiki) |
| `showLineNumbers` | Line-number gutter |
| `collapsible` | Clamped height with gradient fade and an Expand/Collapse control |
| `noCopy` | Suppress the copy button for this block |

Unknown tokens are ignored, so fences stay valid markdown and render normally on
GitHub.

### Tab groups

    :::code-tabs

    ```sh title="pnpm"
    pnpm dlx shadcn-ember@latest add button
    ```

    ```sh title="npm"
    npx shadcn-ember@latest add button
    ```

    :::

Tab label is the fence's `title=` if present, otherwise its language. This adds
`remark-directive` to `@docfy/ember-vite`. Neither this repo's `docs/` nor frontile's
markdown currently uses `:::` at the start of a line, so the change is
non-breaking.

## Components (`@docfy/ember`)

### Refactor first

`components/docfy-demo.gts` packs five components into a single ~250-line file,
and its snippet tab strip is precisely the behaviour `:::code-tabs` needs. Split
it into a `components/docfy-demo/` folder — one component per file
(`description`, `example`, `snippet`, `snippets`, `index`) — and extract the tab
registration and selection logic into a shared `DocfyTabs` primitive.

This is in scope because it is the code being extended, not unrelated cleanup.

### New components

**`DocfyCodeBlock`** — root element carries `docfy-code-block` BEM classes and
yields the original `<pre>` untouched.

| Arg | Type | Default | Purpose |
| --- | --- | --- | --- |
| `@title` | `string?` | — | Header bar text |
| `@language` | `string?` | — | Language label and styling hook |
| `@collapsible` | `boolean` | `false` | Clamp height, show Expand/Collapse |
| `@showLineNumbers` | `boolean` | `false` | Line-number gutter |
| `@copyable` | `boolean` | `true` | Show the copy button |

Behaviour: copy writes `preEl.textContent` to the clipboard, sets a transient
"Copied" state announced via `aria-live="polite"`, and uses a real
`<button type="button">` so it stays keyboard reachable. Collapse is a tracked
`isExpanded` driving a `max-height` clamp and gradient fade.

The collapsed height is set in CSS via a `--docfy-code-block-collapsed-height`
custom property defaulting to `16rem`, not as a component argument — consuming
design systems override it per theme rather than per invocation.

`DocfyTabs` is exported from `@docfy/ember` as public API, since consumers
writing their own markdown components will want the same tab strip.

**`DocfyCodeTabs`** — a thin wrapper over `DocfyTabs`, yielding a `Tab` per
fence inside the directive.

**`DocfyDemo::Snippets`** is rebuilt on `DocfyTabs`. Demo snippets gain copy and
collapse for free, because the pipeline rewrites every `<pre>` including those
inside demo ASTs.

### Styles

`@docfy/ember` ships `dist/code-block.css`, importable as
`@docfy/ember/code-block.css`. The `./*.css` export already exists in
`package.json` but currently matches no files.

Contents are structural only: layout, the fade mask, line-number counters, and
`.line[data-highlighted]` backgrounds. Every color resolves through CSS custom
properties so consuming design systems drive them rather than fight them.

## `@docfy/plugin-shiki`

A new workspace package alongside `@docfy/plugin-with-prose`, so `shiki` never
becomes a dependency of `@docfy/core`.

```js
import shiki from '@docfy/plugin-shiki';

export default {
  rehypePlugins: [autolinkHeadings, ...shiki()],
};
```

Baked-in defaults:

- Dual light/dark themes emitted as CSS variables — no theme service, no
  re-render, no runtime JS.
- `transformerMetaHighlight` and `transformerMetaWordHighlight`, so `{4,9-12}`
  works out of the box.
- Language aliases: `gjs → glimmer-js`, `gts → glimmer-ts`, `hbs → handlebars`.

Shiki bundles first-class `glimmer-js` and `glimmer-ts` TextMate grammars
(scope `source.gts`), verified in `shikijs/textmate-grammars-themes`. This is a
real improvement over `highlightjs-glimmer` and removes the need for frontile's
hand-written `glimmerTypescript` wrapper.

All options pass through to Shiki for consumers who want different themes or
transformers.

## Frontile rollout

1. Add `@docfy/plugin-shiki` to `site/package.json`.
2. Remove `rehype-highlight`, `highlight.js` and `highlightjs-glimmer`, and
   delete the `glimmerTypescript` wrapper and its comment block from
   `site/docfy.config.mjs`.
3. Delete `site/app/styles/highlight.css` and its import from `app.css`.
4. Add `site/app/styles/docfy-code-block.css` next to the existing
   `docfy-demo.css`, styling the BEM classes with frontile's design tokens.
5. Walk the docs site and confirm every fence, demo snippet and tab group
   renders correctly in both light and dark themes.

## Testing

**`@docfy/ember-vite` (vitest)**
- Unit tests for the fence meta parser, including unknown-token tolerance.
- Integration test: a fence becomes a `DocfyCodeBlock` invocation.
- Integration test: `:::code-tabs` groups consecutive fences with correct labels.
- Regression test: curly escaping still applies after the rewrite.
- Regression test: a text-content mismatch leaves the block unwrapped instead of
  mislabeling it.

**`test-app-vite` (acceptance)**
- Copy writes the expected source to a stubbed clipboard.
- Expand/Collapse toggles state and the control's label.
- Tabs switch the visible panel.
- Highlighted-line markup is present when the Shiki preset is configured.

**`test-app-vite` (integration)**
- `DocfyCodeBlock` and `DocfyTabs` in isolation, including keyboard interaction.

## Documentation

A new `docs/ember/code-blocks.md` covering the fence meta vocabulary, the
`:::code-tabs` directive, and the recommended `@docfy/plugin-shiki` setup —
including the degraded behaviour when no highlighter is configured.

This is external-facing documentation and needs a human read before it
publishes.

## Risks

1. **mdast/hast order desync.** A consumer rehype plugin that inserts or removes
   a `<pre>` would shift the zip. Mitigated by validating each pairing against
   text content and leaving unmatched blocks unwrapped.
2. **Clipboard API requires a secure context.** Tests stub it; the button hides
   itself when the API is unavailable.
3. **Classic apps diverge from vite apps.** `@docfy/ember-cli` consumers keep
   bare `<pre>` while vite consumers get the full component. This is an accepted
   gap and must be stated in the release notes, not discovered.
4. **`remark-directive` changes `:::` parsing** for `@docfy/ember-vite`
   consumers. Verified unused in this repo and in frontile, but it is a
   behaviour change for downstream users and belongs in the release notes.
