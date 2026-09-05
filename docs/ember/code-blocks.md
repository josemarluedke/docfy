---
order: 7
---

# Code Blocks

`@docfy/ember` ships a `DocfyCodeBlock` component that every fenced code block
in your markdown is automatically wrapped in when you use `@docfy/ember-vite`.
It adds the things a reader actually reaches for on a documentation site: a
copy button, an optional title bar, a collapse toggle for long snippets, and
(when a Shiki-based highlighter is configured) line numbers and highlighted
line ranges. A `:::code-tabs` directive groups a run of fences — most
commonly "here's the install command for every package manager" — into a
single tabbed widget.

None of this requires you to change how you write markdown. You still write
plain fenced code blocks; Docfy rewrites them into `<DocfyCodeBlock>`
invocations during the build. The only thing you write by hand is the fence's
**meta string** — the text after the language on the opening backticks — to
opt individual blocks into these features.

## Setting it up

Two things need to be true for the examples on this page to render the way
they do:

1. `@docfy/ember`'s stylesheet is imported somewhere in your app's CSS:

   ```css
   @import '@docfy/ember/code-block.css';
   ```

   This is what defines `.docfy-code-block` and its theming custom
   properties (see [Theming](#theming) below). Without it the component still
   works — the toggle still toggles, the copy button still copies — it just
   has no layout or styling.

2. A Shiki-based highlighter is wired into your `rehypePlugins`, via
   `@docfy/plugin-shiki`:

:::code-tabs

```sh title="pnpm"
pnpm add @docfy/plugin-shiki
```

```sh title="npm"
npm install @docfy/plugin-shiki
```

```sh title="yarn"
yarn add @docfy/plugin-shiki
```

```sh title="bun"
bun add @docfy/plugin-shiki
```

:::

Then spread its return value into `rehypePlugins` in `docfy.config.mjs`:

```js title="docfy.config.mjs"
import autolinkHeadings from 'rehype-autolink-headings';
import shiki from '@docfy/plugin-shiki';

export default {
  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }], ...shiki()],
  // ...sources, sections, etc.
};
```

**This second step is what this page is built with.** Every fence below is
tokenized by the real Shiki highlighter this preset builds — including the
`.gts`/`.gjs`/`.hbs` examples further down, which is the main reason
`@docfy/plugin-shiki` exists in the first place (see
[Glimmer support](#the-glimmer-grammars)).

It's worth being precise about which feature depends on which piece, because
they're independent:

- **Title, copy, and collapse** are rendered by `DocfyCodeBlock` itself. They
  work with any highlighter — `rehype-highlight`, no highlighter at all, or
  Shiki — because they only need the raw `<pre>` that wraps the code.
- **Line numbers and highlighted line ranges** are Shiki features
  (`transformerMetaHighlight` walks the fence's `{4,9-12}` meta and marks
  matching `.line` elements; the line-number gutter is CSS `counter()` driven
  off those same `.line` elements). If you aren't using a Shiki-based
  highlighter, `showLineNumbers` and a `{...}` range in a fence's meta are
  silently ignored — nothing breaks, the lines just render unnumbered and
  unhighlighted.

If you'd rather not preload a highlighter at build time and want highlighting
to happen live in the browser instead, see
[Runtime highlighting with ember-shiki](#runtime-highlighting-with-ember-shiki)
below.

## Fence meta reference

Everything below is written directly after the language on a fence's opening
line, space-separated, in any order:

| Token           | Example                          | Effect                                                                    |
| --------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `title="..."`   | `` ```ts title="app/foo.ts" ``    | Renders a header bar above the code with that text.                       |
| `{a,b-c}`       | `` ```ts {2,4-6} ``               | Highlights lines 2, 4, 5, and 6 (Shiki-based highlighter required).       |
| `showLineNumbers` | `` ```ts showLineNumbers ``     | Adds a line-number gutter (Shiki-based highlighter required).             |
| `collapsible`   | `` ```ts collapsible ``          | Wraps the block in an expand/collapse toggle with a fade at the cutoff.   |
| `noCopy`        | `` ```ts noCopy ``                | Hides the copy button for this block.                                     |

Tokens combine freely on the same fence, as several of the examples below
demonstrate.

## Live examples

### A title

A `title` is the most common thing to reach for — it turns an anonymous
snippet into "this is the file you're meant to add this to."

```ts title="app/utils/format-currency.ts"
export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}
```

### Highlighted lines and line numbers

Line numbers make it possible to talk about "line 9" in prose next to the
block; a highlighted range draws the reader's eye to the part that actually
changed. Both come from Shiki, and both are declared entirely in the fence's
meta — no extra markup, no separate diff format.

```ts title="app/services/session.ts" {4,9-12} showLineNumbers
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SessionService extends Service {
  @tracked currentUser = null;

  @action
  async login(email: string, password: string): Promise<void> {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.currentUser = await response.json();
  }

  @action
  logout(): void {
    this.currentUser = null;
  }
}
```

Line 4 highlights the `session` service injection that this snippet doesn't
actually use yet (a deliberate example of "here's what to add next"); lines
9-12 highlight the `fetch` call inside `login`.

### Collapsible

A `collapsible` fence starts closed at a fixed height (themeable via
`--docfy-code-block-collapsed-height`, see [Theming](#theming)) with a fade at
the cutoff, and a toggle button to expand it. Reach for this on reference
snippets that are correct to include in full but that most readers won't want
taking up the whole page by default.

```gts collapsible title="app/components/data-table.gts"
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn, get } from '@ember/helper';
import { on } from '@ember/modifier';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableSignature {
  Args: {
    columns: Column[];
    rows: Record<string, unknown>[];
  };
  Element: HTMLTableElement;
}

export default class DataTable extends Component<DataTableSignature> {
  @tracked sortKey: string | null = null;
  @tracked sortDirection: 'asc' | 'desc' = 'asc';

  get sortedRows(): Record<string, unknown>[] {
    const { sortKey, sortDirection } = this;

    if (!sortKey) {
      return this.args.rows;
    }

    const sorted = [...this.args.rows].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];

      if (left === right) return 0;
      return left! < right! ? -1 : 1;
    });

    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }

  @action
  sortBy(column: Column): void {
    if (!column.sortable) {
      return;
    }

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
  }

  <template>
    <table ...attributes>
      <thead>
        <tr>
          {{#each @columns as |column|}}
            <th>
              {{#if column.sortable}}
                <button type="button" {{on "click" (fn this.sortBy column)}}>
                  {{column.label}}
                </button>
              {{else}}
                {{column.label}}
              {{/if}}
            </th>
          {{/each}}
        </tr>
      </thead>
      <tbody>
        {{#each this.sortedRows as |row|}}
          <tr>
            {{#each @columns as |column|}}
              <td>{{get row column.key}}</td>
            {{/each}}
          </tr>
        {{/each}}
      </tbody>
    </table>
  </template>
}
```

### noCopy

Not every code block is meant to be pasted into a terminal. A shell
**transcript** — prompts and output mixed together — reads better without a
copy button implying the whole thing is a runnable command:

```sh noCopy
$ ember serve
building... 3214ms
Livereload server on http://localhost:7020
Serving on http://localhost:4200/
```

### `:::code-tabs`

Wrap a run of consecutive fences in a `:::code-tabs` container directive and
Docfy turns them into a single tabbed widget — one tab per fence, labeled
from that fence's `title=` or, failing that, its language. You already saw
this above in [Setting it up](#setting-it-up) for the pnpm/npm/yarn/bun
install commands; that's the canonical use case. Written out, the source for
that block looks like this:

````md
:::code-tabs

```sh title="pnpm"
pnpm add @docfy/plugin-shiki
```

```sh title="npm"
npm install @docfy/plugin-shiki
```

:::
````

Every other fence feature still applies inside a tab — a tab's fence can
have its own `title`, be `collapsible`, highlight a line range, and so on.

## The glimmer grammars

The reason `@docfy/plugin-shiki` exists, ahead of every other feature on this
page, is that Shiki ships real TextMate grammars for `.gjs` and `.gts` —
`glimmer-js` and `glimmer-ts` — so a fence in either language tokenizes
`<template>` tags and `{{mustaches}}` correctly instead of being highlighted
as (or worse, falling back to) plain JavaScript. Since `gts` is the majority
language across Ember app and addon documentation, this is the single most
load-bearing thing this preset does. `.hbs` gets the same treatment via the
`handlebars` grammar.

```gts title="app/components/greeting.gts"
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

interface GreetingSignature {
  Args: { name: string };
  Element: HTMLDivElement;
}

export default class Greeting extends Component<GreetingSignature> {
  @tracked count = 0;

  @action
  increment(): void {
    this.count++;
  }

  <template>
    <div ...attributes>
      <p>Hello, {{@name}}! You clicked {{this.count}} times.</p>
      <button type="button" {{on "click" this.increment}}>
        Click me
      </button>
    </div>
  </template>
}
```

The `.gjs` grammar covers the same syntax without the TypeScript-only bits:

```gjs title="app/components/greeting.gjs"
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export default class Greeting extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count++;
  }

  <template>
    <div ...attributes>
      <p>Hello, {{@name}}! You clicked {{this.count}} times.</p>
      <button type="button" {{on "click" this.increment}}>Click me</button>
    </div>
  </template>
}
```

And a plain `.hbs` template, no `<template>` tag involved, just mustaches and
block syntax:

```hbs title="app/templates/components/greeting.hbs"
<div ...attributes>
  <p>Hello, {{@name}}! You clicked {{this.count}} times.</p>
  {{#if @showButton}}
    <button type="button" {{on "click" this.increment}}>
      Click me
    </button>
  {{/if}}
</div>
```

A fence in a language this preset doesn't preload (anything outside the
curated set of `glimmer-ts`, `glimmer-js`, `handlebars`, `javascript`,
`typescript`, `jsx`, `tsx`, `json`, `css`, `scss`, `html`, `markdown`,
`shellscript`, `diff`, and `yaml`) degrades to plain, unhighlighted text
rather than throwing — a docs build never fails because of a stray
` ```rust ` fence. See the `@docfy/plugin-shiki` README for the full list and
for adding your own languages.

## Theming

`@docfy/ember/code-block.css` exposes four custom properties, scoped to
`.docfy-code-block`, so you can retheme the component without overriding its
rules directly:

| Custom property                            | Default                          | Controls                                                        |
| ------------------------------------------- | --------------------------------- | ----------------------------------------------------------------- |
| `--docfy-code-block-collapsed-height`      | `16rem`                          | How tall a `collapsible` block is before it's expanded.          |
| `--docfy-code-block-fade`                  | `var(--docfy-code-block-background, #fff)` | The color the fade-out gradient fades *to* — set this to your page background, or the fade will look like a visible box. |
| `--docfy-code-block-highlight-background`  | `rgb(101 117 133 / 20%)`         | Background color of a `{a,b-c}`-highlighted line.                |
| `--docfy-code-block-line-number-color`     | `rgb(115 138 148 / 60%)`         | Text color of the `showLineNumbers` gutter.                       |

Set them wherever you already theme your app, for example alongside a dark
mode:

```css
:root {
  --docfy-code-block-collapsed-height: 20rem;
  --docfy-code-block-fade: #ffffff;
}

.dark {
  --docfy-code-block-fade: #0d1117;
  --docfy-code-block-highlight-background: rgb(56 139 253 / 15%);
  --docfy-code-block-line-number-color: rgb(140 140 140 / 60%);
}
```

## Limitations

- **`@docfy/ember-cli` (the classic, non-Vite build) does not get this
  feature.** `DocfyCodeBlock`/`DocfyCodeTabs` wrapping and `@docfy/plugin-shiki`
  are both part of the `@docfy/ember-vite` pipeline described on this page.
  A classic app's code fences render as plain `<pre><code>` the way they
  always have.
- Line numbers and highlighted ranges require a Shiki-based highlighter, as
  covered in [Setting it up](#setting-it-up). Title, copy, and collapse do
  not.

### Runtime highlighting with `ember-shiki`

This page (and `@docfy/plugin-shiki`) highlight at **build time**: the theme
is baked into the generated HTML as CSS variables, so switching light/dark
themes needs no JavaScript and no re-highlighting. If you instead want
highlighting to happen live in the browser — for example, to highlight code
that's generated or edited at runtime, which build-time highlighting can't
reach — use [`ember-shiki`](https://github.com/toranb/ember-shiki) directly
in your own components. It's unrelated to `@docfy/plugin-shiki` and to the
`DocfyCodeBlock` component described here; the two solve different problems
and aren't meant to be combined on the same block.
