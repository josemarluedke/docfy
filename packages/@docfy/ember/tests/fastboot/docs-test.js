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

  test('it renders the docs nav', async function (assert) {
    await visit('/docs');

    assert
      .dom('[data-test-id="docs-nav"]')
      .hasText(
        'Welcome to Docfy Introduction Installation Overview @docfy/core Overview Helpers genereateFlatOutput genereateNestedOutput @docfy/ember Working with Ember Installation Components Docfy Link Component Docfy Output Component'
      );
  });

  test('it renders the previous and next page links', async function (assert) {
    await visit('/docs/introduction');

    assert
      .dom('[data-test-id="docs-previous-next"]')
      .hasText('Previous Welcome to Docfy Next Installation');
  });

  test('it renders the edit url', async function (assert) {
    await visit('/docs/introduction');

    assert
      .dom('[data-test-id="docs-edit-url"]')
      .hasAttribute(
        'href',
        'https://github.com/josemarluedke/docfy/edit/master/packages/@docfy/ember/dummy-docs/introduction.md'
      );
  });
});
