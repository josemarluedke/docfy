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
