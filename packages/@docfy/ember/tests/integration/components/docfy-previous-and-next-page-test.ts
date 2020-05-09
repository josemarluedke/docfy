import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | DocfyPreviousAndNextPage', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields previous and next pages', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/introduction');

    await render(hbs`
    <DocfyPreviousAndNextPage as |previous next|>
      <div data-test-id="previous-title">
        {{previous.title}}
      </div>
      <div data-test-id="next-title">
        {{next.title}}
      </div>
    </DocfyPreviousAndNextPage>`);

    assert.dom('[data-test-id="previous-title"]').hasText('Welcome to Docfy');
    assert.dom('[data-test-id="next-title"]').hasText('Installation');
  });
});
