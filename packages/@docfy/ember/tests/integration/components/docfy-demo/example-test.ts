import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | DocfyDemo::Example', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the content', async function (assert) {
    await render(hbs`
      <DocfyDemo::Example>
        template block text
      </DocfyDemo::Example>
    `);

    assert.equal(this.element?.textContent?.trim(), 'template block text');
  });
});
