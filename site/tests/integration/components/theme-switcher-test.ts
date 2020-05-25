import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ThemeSwitcher', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    await render(hbs`<ThemeSwitcher />`);

    assert.equal(this.element?.textContent?.trim(), 'template block text');
  });
});
