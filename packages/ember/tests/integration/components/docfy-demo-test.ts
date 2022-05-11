import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | DocfyDemo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <DocfyDemo as |demo|>
        <demo.Example>
          Example
        </demo.Example>
        <demo.Description @title="Heading" @editUrl="http://url.com">
          Demo markdown content
        </demo.Description>
        <demo.Snippets as |Snippet|>
          <Snippet @name="component">
            Component
          </Snippet>
          <Snippet @name="template">
            Template
          </Snippet>
        </demo.Snippets>
      </DocfyDemo>
    `);

    assert.dom('.docfy-demo__example').hasText('Example');
    assert.dom('.docfy-demo__description__header__title').hasText('Heading');
    assert
      .dom('.docfy-demo__description__header__edit-url')
      .hasAttribute('href', 'http://url.com');

    assert
      .dom('.docfy-demo__description__content')
      .hasText('Demo markdown content');

    assert.dom('.docfy-demo__snippets__tabs__button').exists({ count: 2 });
    assert
      .dom('.docfy-demo__snippets__tabs__button')
      .hasTextContaining('Component');
    assert.dom('.docfy-demo__snippet').hasTextContaining('Component');

    assert
      .dom('.docfy-demo__snippets__tabs__button:last-child')
      .hasTextContaining('Template');

    await click('.docfy-demo__snippets__tabs__button:last-child');
    assert.dom('.docfy-demo__snippet').hasTextContaining('Template');
  });
});
