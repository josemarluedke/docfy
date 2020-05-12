import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | DocfyDemo::Description', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the content', async function (assert) {
    await render(hbs`
      <DocfyDemo::Description
        @id="my-id"
        @title="My title"
        @editUrl="http://github.com"
      >
        template block text
      </DocfyDemo::Description>
    `);

    assert.dom('.docfy-demo__description__header__title').hasText('My title');
    assert
      .dom('.docfy-demo__description__header__title')
      .hasAttribute('href', '#my-id');
    assert
      .dom('.docfy-demo__description__header__edit-url')
      .hasAttribute('href', 'http://github.com');

    assert
      .dom('.docfy-demo__description__content')
      .hasText('template block text');
  });
});
