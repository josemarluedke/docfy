# Code Block Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Docfy code blocks a copy button, per-instance collapse/expand, a title bar, line numbers, line highlighting and tabbed groups, and swap frontile from highlight.js to build-time Shiki.

**Architecture:** A new `code-blocks` Docfy plugin in `@docfy/ember-vite` parses fence meta at the mdast stage and, after all rehype plugins have run, wraps each `<pre>` in a `<DocfyCodeBlock>` invocation. `@docfy/ember` gains two public components, `DocfyCodeBlock` and `DocfyCodeTabs`, both built on an internal tabs primitive extracted from the existing demo snippet tab strip. Shiki is never a dependency of the component layer — it ships as an opt-in `@docfy/plugin-shiki` preset.

**Tech Stack:** TypeScript, unified/remark/rehype (mdast + hast), Glimmer `.gts` components, Vitest (packages), QUnit + `ember-qunit` (test apps), pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-09-05-code-block-features-design.md`

## Global Constraints

- **`@docfy/ember-cli` is out of scope.** Do not modify `packages/ember-cli/` or `test-app-classic/`. Classic apps keep rendering bare `<pre>`.
- **`@docfy/ember` must not depend on any syntax highlighter.** No `shiki`, no `ember-shiki`, no `highlight.js` in `packages/ember/package.json`.
- **CSS class names are BEM**, matching the existing `docfy-demo` convention: `docfy-code-block`, `docfy-code-block__header`, `docfy-code-block--collapsed`. No Tailwind, no utility classes, no frontile imports.
- **Every colour resolves through a CSS custom property.** Shipped CSS is structural only.
- **The `code-blocks` plugin must be registered BEFORE `escapeCurliesInCode`** in `packages/ember-vite/src/config.ts`. Escaping runs last.
- **Components use `data-test-id` attributes**, matching `docfy-demo`'s existing convention, so acceptance tests have stable selectors.
- Node `>=22.22.2`. Package versions in this monorepo are `0.13.1`; new packages use `workspace:^0.13.1` for internal deps.
- Commit after every task. Never `git add -A` — stage only the files the task names.
- **`test-app-vite` has a known-failing baseline. "PASS" means NO NEW FAILURES, not zero failures.** As of commit `816dc54` the suite runs 87 tests with **6 pre-existing failures**, none of which this plan causes or is responsible for fixing:
  1. `Acceptance | demo rendering: it renders demos on documentation pages` — missing `[data-test-demo-id="docfy-demo-components-docfy-previous-and-next-page-simple"]`
  2. `Acceptance | DocfyLink conversion: it converts internal links to DocfyLink components in markdown content` — promise rejected on `/docs/ember/configuration`
  3. `Acceptance | DocfyLink conversion: it converts internal links in demo pages`
  4. `Acceptance | DocfyLink conversion: it adds proper imports for DocfyLink in generated templates` — promise rejected on `/docs/ember/configuration`
  5. `Integration | Component | DocfyLink: active state is derived from the current URL`
  6. `Integration | Component | DocfyLink: an unrecognised @to is left to the browser` — flaky; navigates the browser away and sometimes trips a 10s timeout, which also suppresses the whole run's last entry
  Compare your run's failure list against these six by NAME. Any failure not on this list is yours to fix. Do not "fix" the six.
- **Run the suite outside any command sandbox.** Chrome cannot launch inside one (`Operation not permitted`, crashpad/socket errors), which produces a misleading failure that looks like a code problem.

---

### Task 1: Extract the internal tabs primitive and split `docfy-demo.gts`

Pure refactor. `docfy-demo.gts` is a 250-line file holding five components, and its snippet tab strip is the exact behaviour `:::code-tabs` needs. Extract it before building on it.

The primitive is **internal**: not exported from `index.ts`, not in the template registry, and deliberately outside `components/` so rollup's `appReexports(['components/**/*.js'])` does not leak it into consuming apps. `DocfyCodeTabs` (Task 5) is the only public tab component.

**Files:**
- Create: `packages/ember/src/-private/tabs.gts`
- Create: `packages/ember/src/components/docfy-demo/index.gts`
- Create: `packages/ember/src/components/docfy-demo/description.gts`
- Create: `packages/ember/src/components/docfy-demo/example.gts`
- Create: `packages/ember/src/components/docfy-demo/snippet.gts`
- Create: `packages/ember/src/components/docfy-demo/snippets.gts`
- Delete: `packages/ember/src/components/docfy-demo.gts`
- Modify: `packages/ember/src/index.ts`
- Modify: `packages/ember/src/template-registry.ts`
- Test: `test-app-vite/tests/integration/components/docfy-demo-test.gts` (existing — must keep passing unchanged)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `Tabs` — default export of `src/-private/tabs.gts`, **internal**. Yields `{ Tab, List, items, select, isActive }`; a tab is registered by rendering `<tabs.Tab @label="pnpm">…</tabs.Tab>`.
  - `TabRegistration` — `{ id: string; label: string }`, exported from the same module.
  - `DocfyDemo` — default export of `docfy-demo/index.gts`, same public signature as today.

- [ ] **Step 1: Run the existing demo tests to capture the green baseline**

```bash
pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: PASS. Record the passing count — the refactor must not change it.

- [ ] **Step 2: Create the internal tabs primitive**

Create `packages/ember/src/-private/tabs.gts`.

`Tabs` owns only registration and selection state. It yields both a default
`List` and the raw state, so `docfy-demo` can keep rendering its own tab strip
markup with its existing `data-test-id`s while sharing the logic. This is what
makes Task 1 a behaviour-preserving refactor.

Nothing here is exported from the package — `DocfyCodeTabs` in Task 5 is the
public surface.

The `schedule('render', …)` call is lifted verbatim from `DocfyDemoSnippets` —
children register during their own render pass, and removing the deferral causes
a double-render assertion.

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { schedule } from '@ember/runloop';
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import type Owner from '@ember/owner';
import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

export interface TabRegistration {
  id: string;
  label: string;
}

interface TabArgs {
  label: string;
  active?: string;
  registerTab?: (tab: TabRegistration) => void;
}

interface TabSignature {
  Args: TabArgs;
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

export class Tab extends Component<TabSignature> {
  id = guidFor(this);

  constructor(owner: Owner, args: TabArgs) {
    super(owner, args);

    if (typeof this.args.registerTab === 'function') {
      this.args.registerTab({ id: this.id, label: this.args.label });
    }
  }

  // Rendered outside a Tabs (the single-snippet demo case) there is no
  // registration, and the panel is always visible.
  get isActive(): boolean {
    if (typeof this.args.registerTab !== 'function') {
      return true;
    }
    return this.id === this.args.active;
  }

  <template>
    {{#if this.isActive}}
      <div
        class="docfy-tabs__panel"
        data-test-id="docfy-tabs-panel"
        data-test-tab-label="{{@label}}"
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

interface TabsListArgs {
  items: TabRegistration[];
  select: (id: string) => void;
  isActive: (id: string) => boolean;
}

interface TabsListSignature {
  Args: TabsListArgs;
  Element: HTMLDivElement;
}

const TabsList: TOC<TabsListSignature> = <template>
  <div
    class="docfy-tabs__list"
    role="tablist"
    data-test-id="docfy-tabs-list"
    ...attributes
  >
    {{#each @items as |tab|}}
      <button
        type="button"
        role="tab"
        class="docfy-tabs__list__button
          {{if (@isActive tab.id) 'docfy-tabs__list__button--active'}}"
        data-test-id="docfy-tabs-button"
        data-test-tab-label="{{tab.label}}"
        aria-selected="{{if (@isActive tab.id) 'true' 'false'}}"
        {{on "click" (fn @select tab.id)}}
      >
        {{tab.label}}
      </button>
    {{/each}}
  </div>
</template>;

interface TabsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        Tab: typeof Tab;
        List: ComponentLike<{ Element: HTMLDivElement }>;
        items: TabRegistration[];
        select: (id: string) => void;
        isActive: (id: string) => boolean;
      },
    ];
  };
}

export default class Tabs extends Component<TabsSignature> {
  @tracked items: TabRegistration[] = [];
  @tracked active?: string;

  @action registerTab(tab: TabRegistration): void {
    schedule('render', this, () => {
      this.items = [...this.items, tab];
      if (!this.active) {
        this.active = tab.id;
      }
    });
  }

  @action select(id: string): void {
    this.active = id;
  }

  isActive = (id: string): boolean => this.active === id;

  <template>
    <div class="docfy-tabs" data-test-id="docfy-tabs" ...attributes>
      {{yield
        (hash
          Tab=(component Tab registerTab=this.registerTab active=this.active)
          List=(component
            TabsList items=this.items select=this.select isActive=this.isActive
          )
          items=this.items
          select=this.select
          isActive=this.isActive
        )
      }}
    </div>
  </template>
}
```

- [ ] **Step 3: Split `docfy-demo.gts` into the folder**

Move `DocfyDemoDescription` and `DocfyDemoExample` from
`packages/ember/src/components/docfy-demo.gts` into `description.gts` and
`example.gts` under `packages/ember/src/components/docfy-demo/`, copying the
class bodies and templates **verbatim** — their `data-test-id`s are asserted by
`docfy-demo-test.gts` and `demo-rendering-test.ts`.

`snippet.gts` becomes an adapter. Generated templates call it as
`<Snippet @name="template">`, so it translates `@name` into a `@label` and
delegates to the yielded `Tab`. It must also work standalone, for the
single-chunk `<demo.Snippet @name="…">` path where there is no `Tab`:

```gts
import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';

interface DocfyDemoSnippetSignature {
  Args: {
    name: string;
    Tab?: ComponentLike<{
      Args: { label: string };
      Element: HTMLDivElement;
      Blocks: { default: [] };
    }>;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

export default class DocfyDemoSnippet extends Component<DocfyDemoSnippetSignature> {
  // The tab strip has always shown a capitalised name; keep that exact
  // transformation so `[data-test-snippet-name="Template"]` still matches.
  get label(): string {
    const name = this.args.name || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  <template>
    {{#if @Tab}}
      <@Tab
        @label={{this.label}}
        class="docfy-demo__snippet"
        data-test-id="demo-snippet"
        data-test-snippet-name="{{@name}}"
        ...attributes
      >
        {{yield}}
      </@Tab>
    {{else}}
      <div
        class="docfy-demo__snippet"
        data-test-id="demo-snippet"
        data-test-snippet-name="{{@name}}"
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}
```

`snippets.gts` renders its own tab strip from the primitive's yielded state, so the
legacy `data-test-id`s survive:

```gts
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';
import Tabs from '../../-private/tabs.gts';
import DocfyDemoSnippet from './snippet.gts';

interface DocfyDemoSnippetsSignature {
  Blocks: {
    default: [unknown];
  };
}

export default class DocfyDemoSnippets extends Component<DocfyDemoSnippetsSignature> {
  <template>
    <div class="docfy-demo__snippets" data-test-id="demo-snippets">
      <Tabs as |tabs|>
        <div class="docfy-demo__snippets__tabs" data-test-id="demo-tabs" role="tablist">
          {{#each tabs.items as |tab|}}
            <button
              type="button"
              role="tab"
              class="docfy-demo__snippets__tabs__button
                {{if (tabs.isActive tab.id) 'docfy-demo__snippets__tabs__button--active'}}"
              data-test-id="demo-tab-button"
              data-test-snippet-name="{{tab.label}}"
              data-test-is-active="{{if (tabs.isActive tab.id) 'true' 'false'}}"
              aria-selected="{{if (tabs.isActive tab.id) 'true' 'false'}}"
              {{on "click" (fn tabs.select tab.id)}}
            >
              {{tab.label}}
            </button>
          {{/each}}
        </div>

        {{yield (component DocfyDemoSnippet Tab=tabs.Tab)}}
      </Tabs>
    </div>
  </template>
}
```

`index.gts` keeps `DocfyDemo` itself, importing the four subcomponents and
yielding the same hash as before. The only change is that `Snippet` is now the
adapter above, invoked without a `Tab` for the standalone path:

```gts
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import DocfyDemoDescription from './description.gts';
import DocfyDemoExample from './example.gts';
import DocfyDemoSnippet from './snippet.gts';
import DocfyDemoSnippets from './snippets.gts';

interface DocfyDemoSignature {
  Args: { id: string };
  Element: HTMLDivElement;
  Blocks: {
    default: [
      {
        Example: typeof DocfyDemoExample;
        Description: unknown;
        Snippet: typeof DocfyDemoSnippet;
        Snippets: typeof DocfyDemoSnippets;
      },
    ];
  };
}

export default class DocfyDemo extends Component<DocfyDemoSignature> {
  <template>
    <div
      id={{@id}}
      class="docfy-demo"
      data-test-id="docfy-demo"
      data-test-demo-id="{{@id}}"
      ...attributes
    >
      {{yield
        (hash
          Example=DocfyDemoExample
          Description=(component DocfyDemoDescription id=@id)
          Snippet=DocfyDemoSnippet
          Snippets=DocfyDemoSnippets
        )
      }}
    </div>
  </template>
}
```

- [ ] **Step 4: Update the package exports**

`packages/ember/src/index.ts` — change the `DocfyDemo` path. The tabs primitive is intentionally **not** exported:

```ts
export { default as DocfyDemo } from './components/docfy-demo/index.gts';
export { default as DocfyLink } from './components/docfy-link.gts';
export { default as DocfyOutput } from './components/docfy-output.gts';
export { default as DocfyPreviousAndNextPage } from './components/docfy-previous-and-next-page.gts';
export { default as DocfyService } from './services/docfy.ts';
export { addDocfyRoutes } from './routing.ts';
```

`packages/ember/src/template-registry.ts` — the same path change, and nothing added:

```ts
import type DocfyDemo from './components/docfy-demo/index.gts';
import type DocfyLink from './components/docfy-link.gts';
import type DocfyOutput from './components/docfy-output.gts';
import type DocfyPreviousAndNextPage from './components/docfy-previous-and-next-page.gts';

export default interface Registry {
  DocfyDemo: typeof DocfyDemo;
  DocfyLink: typeof DocfyLink;
  DocfyOutput: typeof DocfyOutput;
  DocfyPreviousAndNextPage: typeof DocfyPreviousAndNextPage;
}
```

- [ ] **Step 5: Delete the old file and rebuild**

```bash
rm packages/ember/src/components/docfy-demo.gts
pnpm --filter @docfy/ember build
```

Expected: build succeeds, `packages/ember/dist/components/docfy-demo/index.js` exists.

- [ ] **Step 6: Run the demo tests — they must still pass unchanged**

```bash
pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: PASS, same count as Step 1. If `docfy-demo-test.gts` fails, the refactor changed observable behaviour — fix the component, do not edit the test.

- [ ] **Step 7: Commit**

```bash
git add packages/ember/src/components packages/ember/src/index.ts packages/ember/src/template-registry.ts
git commit -m "refactor(ember): extract internal tabs primitive, split docfy-demo"
```

---

### Task 2: `DocfyCodeBlock` component and shipped CSS

**Files:**
- Create: `packages/ember/src/components/docfy-code-block.gts`
- Create: `packages/ember/src/code-block.css`
- Modify: `packages/ember/src/index.ts`
- Modify: `packages/ember/src/template-registry.ts`
- Test: `test-app-vite/tests/integration/components/docfy-code-block-test.gts`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `DocfyCodeBlock`, default export. Args: `@title?: string`, `@language?: string`, `@collapsible?: boolean`, `@showLineNumbers?: boolean`, `@copyable?: boolean` (defaults `true`). Yields a default block containing the original `<pre>`.

- [ ] **Step 1: Write the failing integration test**

Create `test-app-vite/tests/integration/components/docfy-code-block-test.gts`:

```gts
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { DocfyCodeBlock } from '@docfy/ember';

module('Integration | Component | docfy-code-block', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the yielded pre and no header without a title', async function (assert) {
    await render(
      <template>
        <DocfyCodeBlock @language="js"><pre>const a = 1;</pre></DocfyCodeBlock>
      </template>,
    );

    assert.dom('[data-test-id="code-block"]').exists();
    assert.dom('[data-test-id="code-block"] pre').hasText('const a = 1;');
    assert.dom('[data-test-id="code-block-header"]').doesNotExist();
  });

  test('it renders a header with the title', async function (assert) {
    await render(
      <template>
        <DocfyCodeBlock @title="app.gts"><pre>x</pre></DocfyCodeBlock>
      </template>,
    );

    assert.dom('[data-test-id="code-block-header"]').hasText('app.gts');
  });

  test('it copies the pre text content to the clipboard', async function (assert) {
    const written: string[] = [];
    const original = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          written.push(text);
          return Promise.resolve();
        },
      },
    });

    try {
      await render(
        <template>
          <DocfyCodeBlock><pre>const a = 1;</pre></DocfyCodeBlock>
        </template>,
      );

      await click('[data-test-id="code-block-copy"]');

      assert.deepEqual(written, ['const a = 1;'], 'wrote the pre text content');
      assert.dom('[data-test-id="code-block-copy"]').hasAttribute('data-test-copied', 'true');
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: original,
      });
    }
  });

  test('it does not render the copy button when @copyable is false', async function (assert) {
    await render(
      <template>
        <DocfyCodeBlock @copyable={{false}}><pre>x</pre></DocfyCodeBlock>
      </template>,
    );

    assert.dom('[data-test-id="code-block-copy"]').doesNotExist();
  });

  test('it toggles the collapsed state', async function (assert) {
    await render(
      <template>
        <DocfyCodeBlock @collapsible={{true}}><pre>x</pre></DocfyCodeBlock>
      </template>,
    );

    assert.dom('[data-test-id="code-block"]').hasClass('docfy-code-block--collapsed');
    assert.dom('[data-test-id="code-block-toggle"]').hasText('Expand');

    await click('[data-test-id="code-block-toggle"]');

    assert.dom('[data-test-id="code-block"]').doesNotHaveClass('docfy-code-block--collapsed');
    assert.dom('[data-test-id="code-block-toggle"]').hasText('Collapse');
  });

  test('it renders no toggle when not collapsible', async function (assert) {
    await render(
      <template><DocfyCodeBlock><pre>x</pre></DocfyCodeBlock></template>,
    );

    assert.dom('[data-test-id="code-block-toggle"]').doesNotExist();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: FAIL — `DocfyCodeBlock` is not exported from `@docfy/ember`.

- [ ] **Step 3: Write the component**

Create `packages/ember/src/components/docfy-code-block.gts`. Note the deliberate absence of an element modifier: the copy handler walks up from the button it was clicked on, which keeps the component free of an `ember-modifier` dependency.

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

interface DocfyCodeBlockSignature {
  Args: {
    title?: string;
    language?: string;
    collapsible?: boolean;
    showLineNumbers?: boolean;
    copyable?: boolean;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

const COPIED_FEEDBACK_MS = 2000;

export default class DocfyCodeBlock extends Component<DocfyCodeBlockSignature> {
  @tracked isExpanded = false;
  @tracked didCopy = false;

  private copyTimeout?: ReturnType<typeof setTimeout>;

  // Clipboard access needs a secure context. Rather than render a button that
  // silently does nothing, hide it when the API is absent.
  get isCopyable(): boolean {
    return (
      this.args.copyable !== false &&
      typeof navigator !== 'undefined' &&
      Boolean(navigator.clipboard)
    );
  }

  get isCollapsible(): boolean {
    return this.args.collapsible === true;
  }

  get isCollapsed(): boolean {
    return this.isCollapsible && !this.isExpanded;
  }

  get toggleLabel(): string {
    return this.isExpanded ? 'Collapse' : 'Expand';
  }

  @action toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  @action async copy(event: MouseEvent): Promise<void> {
    const button = event.currentTarget as HTMLElement;
    const pre = button.closest('.docfy-code-block')?.querySelector('pre');

    if (!pre) {
      return;
    }

    await navigator.clipboard.writeText(pre.textContent ?? '');

    this.didCopy = true;
    clearTimeout(this.copyTimeout);
    this.copyTimeout = setTimeout(() => {
      this.didCopy = false;
    }, COPIED_FEEDBACK_MS);
  }

  willDestroy(): void {
    super.willDestroy();
    clearTimeout(this.copyTimeout);
  }

  <template>
    <div
      class="docfy-code-block
        {{if this.isCollapsed 'docfy-code-block--collapsed'}}
        {{if @showLineNumbers 'docfy-code-block--line-numbers'}}"
      data-test-id="code-block"
      data-language="{{@language}}"
      ...attributes
    >
      {{#if @title}}
        <div class="docfy-code-block__header" data-test-id="code-block-header">
          <span class="docfy-code-block__header__title">{{@title}}</span>
        </div>
      {{/if}}

      {{#if this.isCopyable}}
        <button
          type="button"
          class="docfy-code-block__copy"
          data-test-id="code-block-copy"
          data-test-copied="{{if this.didCopy 'true' 'false'}}"
          aria-label="Copy code to clipboard"
          {{on "click" this.copy}}
        >
          <span aria-hidden="true">{{if this.didCopy "Copied" "Copy"}}</span>
        </button>
        <span class="docfy-code-block__status" aria-live="polite">
          {{#if this.didCopy}}Copied to clipboard{{/if}}
        </span>
      {{/if}}

      <div class="docfy-code-block__content">
        {{yield}}
      </div>

      {{#if this.isCollapsible}}
        <button
          type="button"
          class="docfy-code-block__toggle"
          data-test-id="code-block-toggle"
          aria-expanded="{{if this.isExpanded 'true' 'false'}}"
          {{on "click" this.toggle}}
        >
          {{this.toggleLabel}}
        </button>
      {{/if}}
    </div>
  </template>
}
```

- [ ] **Step 4: Write the shipped CSS**

Create `packages/ember/src/code-block.css`. Structural only — every colour is a custom property with a neutral fallback, so a consuming design system overrides them without fighting specificity. Rollup already has `addon.keepAssets(['**/*.css'])`, and `package.json` already exports `./*.css`, so no build config changes are needed.

```css
.docfy-code-block {
  --docfy-code-block-collapsed-height: 16rem;
  --docfy-code-block-fade: var(--docfy-code-block-background, #fff);
  --docfy-code-block-highlight-background: rgb(101 117 133 / 20%);
  --docfy-code-block-line-number-color: rgb(115 138 148 / 60%);

  position: relative;
}

.docfy-code-block__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.docfy-code-block__copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

/* Visually hidden, still announced. */
.docfy-code-block__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.docfy-code-block--collapsed .docfy-code-block__content {
  max-height: var(--docfy-code-block-collapsed-height);
  overflow: hidden;
}

.docfy-code-block--collapsed .docfy-code-block__content::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 6rem;
  pointer-events: none;
  background: linear-gradient(to top, var(--docfy-code-block-fade), transparent);
}

/* Emitted by Shiki's transformerMetaHighlight for `{1,3-5}` fence meta. */
.docfy-code-block .line[data-highlighted] {
  display: inline-block;
  width: 100%;
  background-color: var(--docfy-code-block-highlight-background);
}

.docfy-code-block--line-numbers code {
  counter-reset: docfy-line;
}

.docfy-code-block--line-numbers .line::before {
  counter-increment: docfy-line;
  content: counter(docfy-line);
  display: inline-block;
  width: 2rem;
  margin-right: 1rem;
  text-align: right;
  color: var(--docfy-code-block-line-number-color);
}
```

- [ ] **Step 5: Export the component**

Add to `packages/ember/src/index.ts`:

```ts
export { default as DocfyCodeBlock } from './components/docfy-code-block.gts';
```

Add to `packages/ember/src/template-registry.ts` — the import alongside the others, and `DocfyCodeBlock: typeof DocfyCodeBlock;` in the `Registry` interface.

- [ ] **Step 6: Run the tests to verify they pass**

```bash
pnpm --filter @docfy/ember build && pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: PASS, including all six new `docfy-code-block` tests.

- [ ] **Step 7: Commit**

```bash
git add packages/ember/src/components/docfy-code-block.gts packages/ember/src/code-block.css packages/ember/src/index.ts packages/ember/src/template-registry.ts test-app-vite/tests/integration/components/docfy-code-block-test.gts
git commit -m "feat(ember): add DocfyCodeBlock with copy, collapse and title bar"
```

---

### Task 3: Fence meta parser

A pure function, tested in isolation, so the plugin task can focus on tree manipulation.

**Files:**
- Create: `packages/ember-vite/src/docfy-plugins/fence-meta.ts`
- Test: `packages/ember-vite/tests/fence-meta.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  export interface CodeBlockOptions {
    title?: string;
    showLineNumbers: boolean;
    collapsible: boolean;
    copyable: boolean;
  }
  export function parseFenceMeta(meta?: string | null): CodeBlockOptions;
  ```

- [ ] **Step 1: Write the failing test**

Create `packages/ember-vite/tests/fence-meta.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import { parseFenceMeta } from '../src/docfy-plugins/fence-meta.js';

describe('parseFenceMeta', () => {
  test('returns defaults for empty meta', () => {
    expect(parseFenceMeta()).toEqual({
      title: undefined,
      showLineNumbers: false,
      collapsible: false,
      copyable: true,
    });
    expect(parseFenceMeta('')).toEqual(parseFenceMeta());
    expect(parseFenceMeta(null)).toEqual(parseFenceMeta());
  });

  test('parses a double-quoted title', () => {
    expect(parseFenceMeta('title="components/ui/tabs.gts"').title).toBe(
      'components/ui/tabs.gts',
    );
  });

  test('parses a single-quoted title', () => {
    expect(parseFenceMeta("title='app.gts'").title).toBe('app.gts');
  });

  test('parses a title containing spaces', () => {
    expect(parseFenceMeta('title="my file.gts" collapsible').title).toBe('my file.gts');
  });

  test('parses boolean flags', () => {
    const result = parseFenceMeta('showLineNumbers collapsible noCopy');
    expect(result.showLineNumbers).toBe(true);
    expect(result.collapsible).toBe(true);
    expect(result.copyable).toBe(false);
  });

  test('ignores Shiki line-range tokens', () => {
    const result = parseFenceMeta('{4,9-12} title="a.ts"');
    expect(result.title).toBe('a.ts');
    expect(result.collapsible).toBe(false);
  });

  test('ignores unknown tokens rather than throwing', () => {
    expect(() => parseFenceMeta('twoslash somethingElse=1')).not.toThrow();
    expect(parseFenceMeta('twoslash').copyable).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
pnpm --filter @docfy/ember-vite test 2>&1 | tail -20
```

Expected: FAIL — cannot resolve `../src/docfy-plugins/fence-meta.js`.

- [ ] **Step 3: Write the implementation**

Create `packages/ember-vite/src/docfy-plugins/fence-meta.ts`:

```ts
/**
 * Options a docs author can set on a fence's meta string.
 *
 * Only the tokens Shiki ignores are handled here. Line ranges (`{4,9-12}`) and
 * word highlighting are parsed by Shiki's own transformers, so this parser
 * deliberately skips them rather than reimplementing range syntax.
 */
export interface CodeBlockOptions {
  title?: string;
  showLineNumbers: boolean;
  collapsible: boolean;
  copyable: boolean;
}

// Matches `title="a b.gts"` or `title='a b.gts'`, capturing the quoted value.
const TITLE_PATTERN = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/;

export function parseFenceMeta(meta?: string | null): CodeBlockOptions {
  const value = meta ?? '';
  const titleMatch = TITLE_PATTERN.exec(value);
  const title = titleMatch ? (titleMatch[1] ?? titleMatch[2]) : undefined;

  // Strip the title before splitting on whitespace, so a title containing
  // spaces cannot be mistaken for flag tokens.
  const flags = value.replace(TITLE_PATTERN, ' ').split(/\s+/).filter(Boolean);

  return {
    title,
    showLineNumbers: flags.includes('showLineNumbers'),
    collapsible: flags.includes('collapsible'),
    copyable: !flags.includes('noCopy'),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
pnpm --filter @docfy/ember-vite test 2>&1 | tail -20
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add packages/ember-vite/src/docfy-plugins/fence-meta.ts packages/ember-vite/tests/fence-meta.test.ts
git commit -m "feat(ember-vite): add fence meta string parser"
```

---

### Task 4: The `code-blocks` Docfy plugin

**Files:**
- Create: `packages/ember-vite/src/docfy-plugins/code-blocks.ts`
- Create: `packages/ember-vite/tests/__fixtures__/code-blocks/index.md`
- Create: `packages/ember-vite/tests/code-blocks.test.ts`
- Modify: `packages/ember-vite/src/docfy-plugins/index.ts`
- Modify: `packages/ember-vite/src/config.ts:175-188`
- Modify: `packages/ember-vite/src/import-map.ts`

**Interfaces:**
- Consumes: `parseFenceMeta` and `CodeBlockOptions` from Task 3; `DocfyCodeBlock` from Task 2.
- Produces: default-exported Docfy plugin `codeBlocks`. Fence options are held in a module-level `WeakMap` keyed by page, not on `pluginData` — nothing outside the plugin reads them.

- [ ] **Step 1: Write the fixture**

Create `packages/ember-vite/tests/__fixtures__/code-blocks/index.md`:

````markdown
---
title: Code Blocks
---

# Code Blocks

A plain fence:

```js
const a = 1;
```

A fence with options:

```gts title="app/components/thing.gts" collapsible showLineNumbers
const b = 2;
```

A fence with copying disabled:

```sh noCopy
echo hi
```

A fence containing curlies, which Ember's template compiler would otherwise
try to parse as a mustache:

```hbs
{{#if this.value}}<span>{{this.value}}</span>{{/if}}
```
````

- [ ] **Step 2: Write the failing test**

Create `packages/ember-vite/tests/code-blocks.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';
import escapeCurliesInCode from '../src/docfy-plugins/escape-curlies-in-code.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/code-blocks');

async function renderFixture(plugins = [codeBlocks]) {
  const docfy = new Docfy({ plugins });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!;
}

describe('code-blocks plugin', () => {
  test('wraps every pre in a DocfyCodeBlock invocation', async () => {
    const page = await renderFixture();
    const opens = page.rendered.match(/<DocfyCodeBlock/g) ?? [];
    const closes = page.rendered.match(/<\/DocfyCodeBlock>/g) ?? [];

    expect(opens).toHaveLength(4);
    expect(closes).toHaveLength(4);
  });

  test('passes the parsed fence options as arguments', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('@language="gts"');
    expect(page.rendered).toContain('@title="app/components/thing.gts"');
    expect(page.rendered).toContain('@collapsible={{true}}');
    expect(page.rendered).toContain('@showLineNumbers={{true}}');
    expect(page.rendered).toContain('@copyable={{false}}');
  });

  test('omits arguments that are at their default', async () => {
    const page = await renderFixture();
    const plain = page.rendered.slice(
      page.rendered.indexOf('<DocfyCodeBlock'),
      page.rendered.indexOf('</DocfyCodeBlock>'),
    );

    expect(plain).toContain('@language="js"');
    expect(plain).not.toContain('@collapsible');
    expect(plain).not.toContain('@title');
  });

  test('registers the DocfyCodeBlock import', async () => {
    const page = await renderFixture();
    const imports = (page.pluginData as { imports?: { name: string }[] }).imports ?? [];

    expect(imports.map((i) => i.name)).toContain('DocfyCodeBlock');
  });

  test('curly escaping still applies after the rewrite', async () => {
    const page = await renderFixture([codeBlocks, escapeCurliesInCode]);

    // The hbs fence must come out escaped. If the rewrite ran after escaping,
    // or replaced the nodes escaping walks, bare `{{` would survive here and
    // Ember's template compiler would try to parse it as a mustache.
    expect(page.rendered).toContain('\\{{#if this.value}}');
    expect(page.rendered).not.toMatch(/(?<!\\)\{\{#if this\.value\}\}/);
  });

  test('the wrapper argument mustaches are NOT escaped', async () => {
    const page = await renderFixture([codeBlocks, escapeCurliesInCode]);

    // The invocation's own `{{true}}` is real template syntax and must survive
    // the escape pass intact — escaping applies inside `code`, not to the
    // wrapper this plugin emits around it.
    expect(page.rendered).toContain('@collapsible={{true}}');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
pnpm --filter @docfy/ember-vite test code-blocks 2>&1 | tail -20
```

Expected: FAIL — cannot resolve `../src/docfy-plugins/code-blocks.js`.

- [ ] **Step 4: Write the plugin**

Create `packages/ember-vite/src/docfy-plugins/code-blocks.ts`:

```ts
import plugin from '@docfy/core/lib/plugin.js';
import { visit } from 'unist-util-visit';
import { parseFenceMeta, type CodeBlockOptions } from './fence-meta.js';
import { getComponentImport } from '../import-map.js';
import type { Root as MdastRoot } from 'mdast';
import type { Element, Root as HastRoot, RootContent as HastContent } from 'hast';
import type { PageContent } from '@docfy/core/lib/types.js';
import type { PluginData } from '../types.js';

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
 * Escapes a value for interpolation into a double-quoted attribute inside a raw
 * node.
 *
 * Two hazards, both real: `parseFenceMeta` accepts `title='...'`, whose value
 * may contain a double quote and would otherwise close the attribute early; and
 * a title containing `{{` reaches the template as a mustache, because raw nodes
 * are invisible to the `escapeCurliesInCode` pass, which only descends into
 * `code` elements.
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
    args.push(`@language="${block.language}"`);
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

function collect(ast: MdastRoot): RecordedBlock[] {
  const blocks: RecordedBlock[] = [];

  visit(ast, 'code', (node) => {
    blocks.push({
      ...parseFenceMeta(node.meta),
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
      raw('</DocfyCodeBlock>'),
    );
    wrapped = true;
  });

  return wrapped;
}

const RECORDED = new WeakMap<object, RecordedBlock[]>();

export default plugin({
  runWithMdast(ctx): void {
    const record = (page: PageContent<MdastRoot>): void => {
      RECORDED.set(page, collect(page.ast));
      page.demos?.forEach(record);
    };

    ctx.pages.forEach(record);
  },

  runWithHast(ctx): void {
    ctx.pages.forEach((page) => {
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

      if (!pluginData.imports.some((i) => i.name === 'DocfyCodeBlock')) {
        pluginData.imports.push(getComponentImport('DocfyCodeBlock'));
      }
    });
  },
});
```

- [ ] **Step 5: Add the import-map entry**

In `packages/ember-vite/src/import-map.ts`, add to `IMPORT_MAP`:

```ts
  DocfyCodeBlock: {
    name: 'DocfyCodeBlock',
    path: '@docfy/ember',
    isDefault: false,
  },
```

- [ ] **Step 6: Export and register the plugin**

`packages/ember-vite/src/docfy-plugins/index.ts` — add:

```ts
export { default as codeBlocks } from './code-blocks.js';
```

`packages/ember-vite/src/config.ts` — extend the destructure and push the plugin **before** `escapeCurliesInCode`:

```ts
  const { demoComponents, previewTemplates, docfyLinkConversion, codeBlocks, escapeCurliesInCode } =
    await import('./docfy-plugins/index.js');

  docfyConfig.plugins.unshift(
    previewTemplates, // Process preview templates first
    demoComponents, // Then process demo components
    docfyLinkConversion // Finally replace internal links with DocfyLink
  );

  // Wrap every code block before escaping runs: the wrapper is emitted as raw
  // hast, and escaping must be the last thing that touches code text.
  docfyConfig.plugins.push(codeBlocks);

  // Escaping happens at the hast stage so that it also covers markup injected
  // by rehype-based syntax highlighters.
  docfyConfig.plugins.push(escapeCurliesInCode);
```

- [ ] **Step 7: Run the tests to verify they pass**

```bash
pnpm --filter @docfy/ember-vite test 2>&1 | tail -20
```

Expected: PASS, 5 new `code-blocks` tests plus the existing suite.

- [ ] **Step 8: Verify end to end in the test app**

```bash
pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: PASS. Every code block on every docs page is now wrapped; if the app fails to build, the most likely cause is `DocfyCodeBlock` not being exported from `@docfy/ember` — rerun `pnpm --filter @docfy/ember build`.

- [ ] **Step 9: Commit**

```bash
git add packages/ember-vite/src/docfy-plugins/code-blocks.ts packages/ember-vite/src/docfy-plugins/index.ts packages/ember-vite/src/config.ts packages/ember-vite/src/import-map.ts packages/ember-vite/tests/code-blocks.test.ts packages/ember-vite/tests/__fixtures__/code-blocks
git commit -m "feat(ember-vite): wrap code fences in DocfyCodeBlock"
```

---

### Task 5: `:::code-tabs` directive and `DocfyCodeTabs`

**Files:**
- Create: `packages/ember/src/components/docfy-code-tabs.gts`
- Modify: `packages/ember/src/index.ts`
- Modify: `packages/ember/src/template-registry.ts`
- Modify: `packages/ember-vite/src/docfy-plugins/code-blocks.ts`
- Modify: `packages/ember-vite/src/config.ts`
- Modify: `packages/ember-vite/src/import-map.ts`
- Modify: `packages/ember-vite/package.json`
- Create: `packages/ember-vite/tests/__fixtures__/code-tabs/index.md`
- Create: `packages/ember-vite/tests/code-tabs.test.ts`

**Interfaces:**
- Consumes: the internal `Tabs` primitive from Task 1; `parseFenceMeta` from Task 3; the `code-blocks` plugin from Task 4.
- Produces: `DocfyCodeTabs`, default export, yielding `{ Tab }` where `Tab` takes `@label`.

- [ ] **Step 1: Add the dependency**

```bash
pnpm --filter @docfy/ember-vite add remark-directive
pnpm --filter @docfy/ember-vite add -D mdast-util-directive
```

`remark-directive` is the runtime dependency; `mdast-util-directive` supplies the `ContainerDirective` type and the mdast module augmentation.

- [ ] **Step 2: Write the `DocfyCodeTabs` component**

Create `packages/ember/src/components/docfy-code-tabs.gts`:

```gts
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import Tabs from '../-private/tabs.gts';
import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';

// The internal `Tab` renders no element of its own — it is purely a visibility
// gate — so each public tab component owns its panel markup. That is what keeps
// `docfy-demo`'s snippet DOM byte-identical to its pre-refactor markup.
interface DocfyCodeTabSignature {
  Args: {
    label: string;
    tab?: ComponentLike<{ Args: { label: string }; Blocks: { default: [] } }>;
  };
  Element: HTMLDivElement;
  Blocks: { default: [] };
}

const DocfyCodeTab: TOC<DocfyCodeTabSignature> = <template>
  {{#let @tab as |Tab|}}
    <Tab @label={{@label}}>
      <div
        class="docfy-code-tabs__panel"
        data-test-id="code-tabs-panel"
        data-test-tab-label="{{@label}}"
        ...attributes
      >
        {{yield}}
      </div>
    </Tab>
  {{/let}}
</template>;

interface DocfyCodeTabsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [{ Tab: unknown }];
  };
}

export default class DocfyCodeTabs extends Component<DocfyCodeTabsSignature> {
  <template>
    <div class="docfy-code-tabs" data-test-id="code-tabs" ...attributes>
      <Tabs as |tabs|>
        <tabs.List />
        {{yield (hash Tab=(component DocfyCodeTab tab=tabs.Tab))}}
      </Tabs>
    </div>
  </template>
}
```

Export it from `packages/ember/src/index.ts` and add it to `template-registry.ts`, exactly as `DocfyCodeBlock` was in Task 2.

- [ ] **Step 3: Write the fixture**

Create `packages/ember-vite/tests/__fixtures__/code-tabs/index.md`:

`````markdown
---
title: Code Tabs
---

# Code Tabs

:::code-tabs

```sh title="pnpm"
pnpm add thing
```

```sh title="npm"
npm install thing
```

```js
const unlabelled = true;
```

:::
`````

- [ ] **Step 4: Write the failing test**

Create `packages/ember-vite/tests/code-tabs.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import path from 'path';
import remarkDirective from 'remark-directive';
import Docfy from '@docfy/core';
import codeBlocks from '../src/docfy-plugins/code-blocks.js';

const root = path.resolve(import.meta.dirname, './__fixtures__/code-tabs');

async function renderFixture() {
  const docfy = new Docfy({
    plugins: [codeBlocks],
    remarkPlugins: [remarkDirective],
  });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!;
}

describe(':::code-tabs directive', () => {
  test('emits a single DocfyCodeTabs wrapper', async () => {
    const page = await renderFixture();

    expect(page.rendered.match(/<DocfyCodeTabs as \|tabs\|>/g)).toHaveLength(1);
    expect(page.rendered.match(/<\/DocfyCodeTabs>/g)).toHaveLength(1);
  });

  test('labels each tab from the fence title, falling back to the language', async () => {
    const page = await renderFixture();

    expect(page.rendered).toContain('<tabs.Tab @label="pnpm">');
    expect(page.rendered).toContain('<tabs.Tab @label="npm">');
    expect(page.rendered).toContain('<tabs.Tab @label="js">');
  });

  test('still wraps each fence inside the group in a DocfyCodeBlock', async () => {
    const page = await renderFixture();

    expect(page.rendered.match(/<DocfyCodeBlock/g)).toHaveLength(3);
  });

  test('registers both component imports', async () => {
    const page = await renderFixture();
    const imports = (page.pluginData as { imports?: { name: string }[] }).imports ?? [];
    const names = imports.map((i) => i.name);

    expect(names).toContain('DocfyCodeBlock');
    expect(names).toContain('DocfyCodeTabs');
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

```bash
pnpm --filter @docfy/ember-vite test code-tabs 2>&1 | tail -20
```

Expected: FAIL — no `<DocfyCodeTabs` in the output.

- [ ] **Step 6: Handle the directive in the mdast pass**

In `packages/ember-vite/src/docfy-plugins/code-blocks.ts`, add the import and the transform, and call it from `runWithMdast` before `collect`:

```ts
import { html } from './utils.js';
import type { RootContent as MdastContent } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';

const TABS_DIRECTIVE = 'code-tabs';

/**
 * Rewrites `:::code-tabs` containers into a DocfyCodeTabs invocation, one tab
 * per fence. The fences themselves are left in place: the hast pass wraps them
 * in DocfyCodeBlock afterwards, so a tabbed block keeps every other feature.
 */
function expandTabDirectives(ast: MdastRoot): boolean {
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

    const replacement: MdastContent[] = [html('<DocfyCodeTabs as |tabs|>')];

    node.children.forEach((child) => {
      if (child.type !== 'code') {
        // Non-fence content inside the group has no tab to belong to; keep it
        // rather than silently dropping the author's text.
        replacement.push(child as MdastContent);
        return;
      }

      const label = parseFenceMeta(child.meta).title ?? child.lang ?? 'code';

      replacement.push(
        html(`<tabs.Tab @label="${label}">`),
        child as MdastContent,
        html('</tabs.Tab>'),
      );
    });

    replacement.push(html('</DocfyCodeTabs>'));

    parent.children.splice(at, 1, ...replacement);
  });

  return found.length > 0;
}
```

Track whether a page used tabs so the import can be registered. Add a second `WeakMap` beside `RECORDED`:

```ts
const USED_TABS = new WeakMap<object, boolean>();
```

Update `runWithMdast` so it expands directives first, then collects — the order matters because expansion does not add or remove `code` nodes but does change their position:

```ts
  runWithMdast(ctx): void {
    const record = (page: PageContent<MdastRoot>): void => {
      USED_TABS.set(page, expandTabDirectives(page.ast));
      RECORDED.set(page, collect(page.ast));
      page.demos?.forEach(record);
    };

    ctx.pages.forEach(record);
  },
```

And in `runWithHast`, register the extra import when tabs were used:

```ts
      if (USED_TABS.get(page) && !pluginData.imports.some((i) => i.name === 'DocfyCodeTabs')) {
        pluginData.imports.push(getComponentImport('DocfyCodeTabs'));
      }
```

Note the ordering consequence: the `DocfyCodeTabs` import must be pushed inside the same `if (wrapped)` branch, since a `:::code-tabs` block always contains fences and therefore always sets `wrapped`.

- [ ] **Step 7: Add the import-map entry and register `remark-directive`**

In `packages/ember-vite/src/import-map.ts`:

```ts
  DocfyCodeTabs: {
    name: 'DocfyCodeTabs',
    path: '@docfy/ember',
    isDefault: false,
  },
```

In `packages/ember-vite/src/config.ts`, alongside the existing `remark-hbs` registration and **before** it, so directives are parsed before hbs escaping runs:

```ts
  // `:::code-tabs` groups fences into a tabbed component. Neither this repo's
  // docs nor frontile use `:::` for anything else, so enabling directives is
  // non-breaking here.
  const remarkDirective = (await import('remark-directive')).default;
  docfyConfig.remarkPlugins.push(remarkDirective);
```

- [ ] **Step 8: Run the tests to verify they pass**

```bash
pnpm --filter @docfy/ember-vite test 2>&1 | tail -20
pnpm --filter @docfy/ember build && pnpm --filter test-app-vite test 2>&1 | tail -30
```

Expected: PASS for both.

- [ ] **Step 9: Commit**

```bash
git add packages/ember/src/components/docfy-code-tabs.gts packages/ember/src/index.ts packages/ember/src/template-registry.ts packages/ember-vite/src packages/ember-vite/package.json packages/ember-vite/tests/code-tabs.test.ts packages/ember-vite/tests/__fixtures__/code-tabs
git commit -m "feat: add :::code-tabs directive and DocfyCodeTabs component"
```

---

### Task 6: `@docfy/plugin-shiki` preset package

**Files:**
- Create: `packages/plugin-shiki/package.json`
- Create: `packages/plugin-shiki/tsconfig.json`
- Create: `packages/plugin-shiki/eslint.config.mjs`
- Create: `packages/plugin-shiki/README.md`
- Create: `packages/plugin-shiki/src/index.ts`
- Create: `packages/plugin-shiki/tests/index.test.ts`
- Create: `packages/plugin-shiki/tests/__fixtures__/index.md`

**Interfaces:**
- Consumes: nothing from earlier tasks — it is independent and could be built in parallel.
- Produces:
  ```ts
  export interface DocfyShikiOptions {
    themes?: { light: string; dark: string };
    langAlias?: Record<string, string>;
    transformers?: unknown[];
  }
  export default function docfyShiki(options?: DocfyShikiOptions): unknown[];
  ```
  The return value is spread into `rehypePlugins`.

- [ ] **Step 1: Scaffold the package**

Copy `packages/plugin-with-prose/package.json`, `tsconfig.json` and `eslint.config.mjs` as the template. The `package.json` differs in name, description and dependencies:

```json
{
  "name": "@docfy/plugin-shiki",
  "version": "0.13.1",
  "private": false,
  "description": "An opt-in Shiki syntax highlighting preset for Docfy",
  "repository": "https://github.com/josemarluedke/docfy",
  "license": "MIT",
  "author": "Josemar Luedke <josemarluedke@gmail.com>",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": ["lib"],
  "scripts": {
    "compile": "tsc",
    "prepare": "tsc",
    "test": "vitest run",
    "lint": "eslint . --cache",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --cache --write",
    "format:check": "prettier . --cache --check"
  },
  "dependencies": {
    "@shikijs/rehype": "^3.0.0",
    "@shikijs/transformers": "^3.0.0",
    "shiki": "^3.0.0"
  },
  "engines": { "node": ">=22.22.2" },
  "publishConfig": { "access": "public" },
  "type": "module",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    }
  }
}
```

Then install and pin the actual resolved majors:

```bash
pnpm --filter @docfy/plugin-shiki add @shikijs/rehype @shikijs/transformers shiki
pnpm --filter @docfy/plugin-shiki add -D vitest typescript @docfy/core
```

- [ ] **Step 2: Write the fixture and the failing test**

Create `packages/plugin-shiki/tests/__fixtures__/index.md`:

Fence-language inventory across both repos, which is what the alias list has to
cover: `gts` (393 uses), `hbs` (63), `gjs` (1), `handlebars` (1). Everything else
in use — `js`, `ts`, `typescript`, `javascript`, `css`, `html`, `bash`, `sh`,
`md`, `diff`, `json` — is natively bundled by Shiki and needs no alias.

````markdown
---
title: Shiki
---

# Shiki

```gts {2}
const a: number = 1;
const b = <template>{{this.value}}</template>;
```

```gjs
const c = <template>{{this.value}}</template>;
```

```hbs
{{#if this.value}}<span>hi</span>{{/if}}
```

```js
const d = 1;
```
````

Create `packages/plugin-shiki/tests/index.test.ts`:

```ts
import { describe, expect, test } from 'vitest';
import path from 'path';
import Docfy from '@docfy/core';
import docfyShiki from '../src/index.js';

const root = path.resolve(import.meta.dirname, './__fixtures__');

async function render(options?: Parameters<typeof docfyShiki>[0]) {
  const docfy = new Docfy({ rehypePlugins: docfyShiki(options) });
  const result = await docfy.run([{ root, urlPrefix: 'docs', pattern: '**/*.md' }]);
  return result.content[0]!.rendered;
}

describe('docfyShiki', () => {
  test('highlights every language the docs actually use', async () => {
    const html = await render();

    expect(html).toContain('class="shiki');
    // A real grammar tokenises `const` as a keyword; the plain-text fallback
    // would emit a single undifferentiated span.
    expect(html).toMatch(/<span style="[^"]*">const<\/span>/);
  });

  test('resolves the glimmer aliases rather than falling back to plain text', async () => {
    const html = await render();

    // Shiki records the resolved language on the <pre>. If an alias failed to
    // resolve it would say "text" (or throw), which is exactly the silent
    // degradation this preset exists to prevent.
    expect(html).toContain('language="glimmer-ts"');
    expect(html).toContain('language="glimmer-js"');
    expect(html).toContain('language="handlebars"');
    expect(html).toContain('language="js"');
    expect(html).not.toContain('language="text"');
  });

  test('tokenises glimmer template tags inside a gts fence', async () => {
    const html = await render();

    // `<template>` is the thing highlight.js could not handle without the
    // hand-written glimmerTypescript wrapper this preset replaces.
    expect(html).toContain('&#x3C;template>');
  });

  test('emits both themes as CSS variables', async () => {
    const html = await render();

    expect(html).toContain('--shiki-dark');
  });

  test('marks lines named in the fence meta', async () => {
    const html = await render();

    expect(html).toContain('data-highlighted');
  });

  test('accepts custom themes', async () => {
    const html = await render({ themes: { light: 'github-light', dark: 'nord' } });

    expect(html).toContain('--shiki-dark');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
pnpm --filter @docfy/plugin-shiki test 2>&1 | tail -20
```

Expected: FAIL — cannot resolve `../src/index.js`.

- [ ] **Step 4: Write the preset**

Create `packages/plugin-shiki/src/index.ts`:

```ts
import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';

export interface DocfyShikiOptions {
  /**
   * Light and dark themes, emitted as CSS variables so the page switches
   * themes without re-highlighting and without any runtime JavaScript.
   */
  themes?: { light: string; dark: string };

  /**
   * Extra language aliases, merged over the defaults below.
   */
  langAlias?: Record<string, string>;

  /**
   * Extra Shiki transformers, appended after the defaults.
   */
  transformers?: unknown[];
}

/**
 * Shiki bundles first-class `glimmer-js` and `glimmer-ts` TextMate grammars
 * (scope `source.gts`), so `.gjs`/`.gts` fences get real tokenisation rather
 * than falling back to plain JavaScript.
 */
const DEFAULT_LANG_ALIAS: Record<string, string> = {
  gjs: 'glimmer-js',
  gts: 'glimmer-ts',
  hbs: 'handlebars',
};

const DEFAULT_THEMES = { light: 'github-light', dark: 'github-dark' };

export default function docfyShiki(options: DocfyShikiOptions = {}): unknown[] {
  return [
    [
      rehypeShiki,
      {
        themes: options.themes ?? DEFAULT_THEMES,
        defaultColor: false,
        langAlias: { ...DEFAULT_LANG_ALIAS, ...options.langAlias },
        transformers: [
          transformerMetaHighlight(),
          transformerMetaWordHighlight(),
          ...(options.transformers ?? []),
        ],
      },
    ],
  ];
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
pnpm --filter @docfy/plugin-shiki test 2>&1 | tail -20
```

Expected: PASS, 4 tests. If the grammar assertion fails, check that `langAlias` is the correct option name for the installed `@shikijs/rehype` major and adjust — the alias mechanism is the only part of this config that has moved between Shiki majors.

- [ ] **Step 6: Write the README**

Create `packages/plugin-shiki/README.md` documenting installation, the default themes and aliases, how to override them, and the fact that line highlighting via `{1,3-5}` comes from `transformerMetaHighlight` and therefore only works when this preset (or an equivalent Shiki config) is in use.

- [ ] **Step 7: Commit**

```bash
git add packages/plugin-shiki
git commit -m "feat(plugin-shiki): add opt-in Shiki highlighting preset"
```

---

### Task 7: Documentation page and acceptance coverage

**Files:**
- Create: `docs/ember/code-blocks.md`
- Create: `test-app-vite/tests/acceptance/code-blocks-test.ts`
- Modify: `test-app-vite/docfy.config.mjs`
- Modify: `test-app-vite/package.json`
- Modify: `test-app-vite/app/styles/tw.css`

**Interfaces:**
- Consumes: everything from Tasks 1–6.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Switch the test app to the Shiki preset**

```bash
pnpm --filter test-app-vite add @docfy/plugin-shiki
pnpm --filter test-app-vite remove rehype-highlight highlightjs-glimmer
```

In `test-app-vite/docfy.config.mjs`, replace the `rehype-highlight` block and its imports:

```js
import path from 'path';
import { fileURLToPath } from 'url';
import autolinkHeadings from 'rehype-autolink-headings';
import codeImport from 'remark-code-import';
import shiki from '@docfy/plugin-shiki';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  // …repository, tocMaxDepth, remarkPlugins unchanged…
  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }], ...shiki()],
  // …sources and sections unchanged…
};
```

Remove the `./highlight.css` import from `test-app-vite/app/styles/tw.css` and add the shipped stylesheet:

```css
@import '@docfy/ember/code-block.css';
```

- [ ] **Step 2: Write the documentation page**

Create `docs/ember/code-blocks.md` with frontmatter matching the sibling pages in `docs/ember/`, covering:

- The fence meta vocabulary: `title="…"`, `{4,9-12}`, `showLineNumbers`, `collapsible`, `noCopy`.
- The `:::code-tabs` directive, with the pnpm/npm example.
- Setting up `@docfy/plugin-shiki`, and that line highlighting and line numbers only render when a Shiki-based highlighter is configured — copy, collapse and the title bar work regardless.
- Importing `@docfy/ember/code-block.css` and the custom properties available for theming: `--docfy-code-block-collapsed-height`, `--docfy-code-block-fade`, `--docfy-code-block-highlight-background`, `--docfy-code-block-line-number-color`.
- A note that `@docfy/ember-cli` (classic) apps do not get this feature.
- A note that consumers wanting runtime highlighting can use `ember-shiki` directly instead.

The acceptance test in Step 3 depends on this page's content, so it must include
at least these four blocks:

`````markdown
```gts title="app/components/thing.gts" {2}
const a = 1;
const b = 2;
```

```js collapsible
// a long example
```

```sh noCopy
echo hi
```

:::code-tabs

```sh title="pnpm"
pnpm add @docfy/plugin-shiki
```

```sh title="npm"
npm install @docfy/plugin-shiki
```

:::
`````

This page is external-facing documentation. Flag it for a human read before release.

- [ ] **Step 3: Write the acceptance test**

Create `test-app-vite/tests/acceptance/code-blocks-test.ts`:

```ts
import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | code blocks', function (hooks) {
  setupApplicationTest(hooks);

  test('it wraps rendered code fences in the component', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block"]').exists({ count: 1 }, 'at least one block');
    assert.dom('[data-test-id="code-block"] pre').exists();
  });

  test('it renders a title bar for a titled fence', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block-header"]').exists();
  });

  test('it toggles a collapsible block', async function (assert) {
    await visit('/docs/ember/code-blocks');

    const toggle = document.querySelector('[data-test-id="code-block-toggle"]');
    assert.ok(toggle, 'a collapsible block is present');

    await click('[data-test-id="code-block-toggle"]');

    assert
      .dom('[data-test-id="code-block-toggle"]')
      .hasAttribute('aria-expanded', 'true');
  });

  test('it switches code tabs', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-tabs"]').exists();

    const buttons = document.querySelectorAll('[data-test-id="docfy-tabs-button"]');
    assert.dom('[data-test-id="code-tabs-panel"]').exists();
    assert.ok(buttons.length > 1, 'more than one tab');

    await click(buttons[1] as HTMLElement);

    assert
      .dom(buttons[1] as HTMLElement)
      .hasAttribute('aria-selected', 'true');
  });

  test('Shiki marked the highlighted lines', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block"] .line[data-highlighted]').exists();
  });
});
```

The doc page written in Step 2 must therefore contain at least one titled fence, one `collapsible` fence, one fence with a `{n}` line range, and one `:::code-tabs` group — the test depends on it. Adjust the first assertion's count if you write more blocks than expected.

- [ ] **Step 4: Run the full test app suite**

```bash
pnpm --filter test-app-vite test 2>&1 | tail -40
```

Expected: PASS, including the five new acceptance tests.

- [ ] **Step 5: Delete the now-unused highlight stylesheet**

```bash
rm test-app-vite/app/styles/highlight.css
pnpm --filter test-app-vite test 2>&1 | tail -20
```

Expected: PASS — nothing else referenced it.

- [ ] **Step 6: Commit**

```bash
git add docs/ember/code-blocks.md test-app-vite/tests/acceptance/code-blocks-test.ts test-app-vite/docfy.config.mjs test-app-vite/package.json test-app-vite/app/styles pnpm-lock.yaml
git commit -m "docs: document code block features and cover them with acceptance tests"
```

---

### Task 8: Frontile rollout

Runs in `/Users/jluedke/code/oss/frontile`, a **separate repository**. Commit there on its own branch; do not mix with docfy commits.

**Files (all paths relative to the frontile repo):**
- Modify: `site/docfy.config.mjs`
- Modify: `site/package.json`
- Modify: `site/app/styles/app.css`
- Create: `site/app/styles/docfy-code-block.css`
- Delete: `site/app/styles/highlight.css`

**Interfaces:**
- Consumes: `@docfy/plugin-shiki` from Task 6, `@docfy/ember/code-block.css` from Task 2.
- Produces: nothing.

- [ ] **Step 1: Create a branch and link the local packages**

```bash
cd /Users/jluedke/code/oss/frontile
git checkout -b feat/docfy-code-blocks
```

Until the docfy packages are published, point frontile at the local workspace build (`pnpm link` or a `file:` override in `site/package.json`), and rebuild docfy first:

```bash
cd /Users/jluedke/code/oss/docfy && pnpm -r build
```

- [ ] **Step 2: Swap the highlighter in the docfy config**

In `site/docfy.config.mjs`: delete the `highlight`, `glimmer`, `glimmerJavascript` and `common` imports, delete the entire `glimmerTypescript` function and its comment block (Shiki's real `glimmer-ts` grammar replaces it), and replace the `rehypePlugins` array:

```js
import shiki from '@docfy/plugin-shiki';

  rehypePlugins: [autolinkHeadings, ...shiki()],
```

Leave `plugins`, `remarkPlugins`, `sources` and `sections` untouched.

- [ ] **Step 3: Update dependencies**

```bash
cd /Users/jluedke/code/oss/frontile
pnpm --filter site add @docfy/plugin-shiki
pnpm --filter site remove rehype-highlight highlight.js highlightjs-glimmer
```

- [ ] **Step 4: Wire up the stylesheets**

In `site/app/styles/app.css`, remove the `highlight.css` import and add:

```css
@import '@docfy/ember/code-block.css';
@import './docfy-code-block.css';
```

Create `site/app/styles/docfy-code-block.css` overriding the shipped custom properties with frontile's tokens, and styling the header, copy button and toggle to match the site. Follow whatever convention `site/app/styles/docfy-demo.css` already uses for tokens — read it first and match it rather than inventing a parallel scheme.

- [ ] **Step 5: Delete the old stylesheet and build**

```bash
rm site/app/styles/highlight.css
pnpm --filter site build 2>&1 | tail -20
```

Expected: build succeeds with no unresolved import.

- [ ] **Step 6: Verify the rendered site by eye**

```bash
pnpm --filter site start
```

Walk at least: a page with plain fences, a component page with demo snippets (confirm the snippet tabs still work and snippets now have copy buttons), and a `.gts` fence (confirm real glimmer tokenisation, not plain-JS fallback). Check both light and dark themes. Confirm no console errors.

- [ ] **Step 7: Run the frontile test suite**

```bash
pnpm --filter site test 2>&1 | tail -30
```

Expected: PASS. Any failure referencing `hljs-` class names is a test asserting on highlight.js output and needs updating to the Shiki equivalent.

- [ ] **Step 8: Commit**

```bash
git add site/docfy.config.mjs site/package.json site/app/styles pnpm-lock.yaml
git commit -m "feat(site): adopt docfy code block features and Shiki highlighting"
```

---

## Deferred (explicitly not in this plan)

- `@docfy/ember-cli` support. Note the gap in the release notes.
- Automatic package-manager command translation.
- Shiki comment transformers (`// [!code highlight]`, diff notation).
- A `collapsible` default derived from block height rather than explicit opt-in.
