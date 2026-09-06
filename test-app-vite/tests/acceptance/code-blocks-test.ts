import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | code blocks', function (hooks) {
  setupApplicationTest(hooks);

  test('it wraps every rendered code fence in the component', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block"]').exists('at least one code block');
    assert.dom('[data-test-id="code-block"] pre').exists();
  });

  test('it renders a title bar for a titled fence', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block-header"]').exists();

    const headers = document.querySelectorAll('[data-test-id="code-block-header"]');
    const titles = Array.from(headers).map(header => header.textContent?.trim());

    assert.ok(
      titles.includes('app/utils/format-currency.ts'),
      'the titled fence renders its title in the header'
    );
  });

  test('it renders a hidden copy button for a noCopy fence', async function (assert) {
    await visit('/docs/ember/code-blocks');

    const blocks = document.querySelectorAll('[data-test-id="code-block"]');
    const shellTranscript = Array.from(blocks).find(block =>
      block.textContent?.includes('ember serve')
    );

    assert.ok(shellTranscript, 'the noCopy shell transcript block is present');
    assert.notOk(
      shellTranscript?.querySelector('[data-test-id="code-block-copy"]'),
      'it has no copy button'
    );
  });

  test('it toggles a collapsible block', async function (assert) {
    await visit('/docs/ember/code-blocks');

    const toggle = document.querySelector('[data-test-id="code-block-toggle"]');
    assert.ok(toggle, 'a collapsible block is present');
    assert.dom(toggle as HTMLElement).hasAttribute('aria-expanded', 'false');

    await click('[data-test-id="code-block-toggle"]');

    assert
      .dom('[data-test-id="code-block-toggle"]')
      .hasAttribute('aria-expanded', 'true');
  });

  test('it switches code tabs', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-tabs"]').exists();

    const buttons = document.querySelectorAll('[data-test-id="code-tabs-button"]');
    assert.dom('[data-test-id="code-tabs-panel"]').exists();
    assert.ok(buttons.length > 1, 'more than one tab');

    await click(buttons[1] as HTMLElement);

    assert.dom(buttons[1] as HTMLElement).hasAttribute('aria-selected', 'true');
  });

  test('Shiki marked the highlighted lines and rendered token spans', async function (assert) {
    await visit('/docs/ember/code-blocks');

    assert.dom('[data-test-id="code-block"] .line[data-highlighted]').exists();
    assert.dom('[data-test-id="code-block"] .line span[style]').exists();
  });

  test('the glimmer grammars are tokenized rather than left as plain text', async function (assert) {
    await visit('/docs/ember/code-blocks');

    // The component's own wrapper carries the *raw* fence language
    // (`@language`, e.g. "gts"); Shiki's own `<pre>` inside it carries the
    // *resolved* grammar name (e.g. "glimmer-ts") via this preset's
    // `data-language` transformer.
    const gtsBlock = document.querySelector(
      '[data-test-id="code-block"][data-language="gts"] pre[data-language="glimmer-ts"]'
    );
    const gjsBlock = document.querySelector(
      '[data-test-id="code-block"][data-language="gjs"] pre[data-language="glimmer-js"]'
    );
    const hbsBlock = document.querySelector(
      '[data-test-id="code-block"][data-language="hbs"] pre[data-language="handlebars"]'
    );

    assert.ok(gtsBlock, 'a gts fence resolved to the glimmer-ts grammar');
    assert.ok(gjsBlock, 'a gjs fence resolved to the glimmer-js grammar');
    assert.ok(hbsBlock, 'an hbs fence resolved to the handlebars grammar');

    assert.ok(
      gtsBlock?.querySelector('.line span[style]'),
      'the gts block was actually highlighted by Shiki, not left as plain text'
    );
  });
});
