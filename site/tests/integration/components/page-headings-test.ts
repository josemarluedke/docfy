import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | PageHeadings', function (hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function (assert) {
    await render(hbs`
      <PageHeadings>
        template block text
      </PageHeadings>
    `);

    assert.equal(this.element?.textContent?.trim(), 'template block text');
  });
});
