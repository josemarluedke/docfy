import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | docs', function (hooks) {
  setup(hooks);

  test('it renders the docs index', async function (assert) {
    await visit('/docs');

    assert.dom('.markdown h1').hasText('Welcome to Docfy');
  });

  test('it renders a nested route', async function (assert) {
    await visit('/docs/core/overview');

    assert.dom('.markdown h1').hasText('Overview');
  });
});
