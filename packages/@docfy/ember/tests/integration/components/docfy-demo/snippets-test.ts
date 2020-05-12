import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | DocfyDemo:Snippets', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the tabs, and the active snippet', async function (assert) {
    await render(hbs`
      <DocfyDemo::Snippets as |Snippet|>
        <Snippet @name="snippet 1">test 1</Snippet>
        <Snippet @name="snippet 2">test 2</Snippet>
      </DocfyDemo::Snippets>
    `);

    assert.dom('.docfy-demo__snippets__tabs__button').exists({ count: 2 });
    assert
      .dom('.docfy-demo__snippets__tabs__button')
      .hasTextContaining('Snippet 1');
    assert.dom('.docfy-demo__snippet').hasTextContaining('test 1');

    assert
      .dom('.docfy-demo__snippets__tabs__button:last-child')
      .hasTextContaining('Snippet 2');
    await click('.docfy-demo__snippets__tabs__button:last-child');
    assert.dom('.docfy-demo__snippet').hasTextContaining('test 2');
  });
});
