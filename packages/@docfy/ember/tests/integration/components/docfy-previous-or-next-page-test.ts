import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | DocfyPreviousOrNextPage', function (hooks) {
  setupRenderingTest(hooks);
  const template = hbs`
    <DocfyPreviousOrNextPage @isPrevious={{this.isPrevious}} as |page|>
      <div data-test-id="title">
        {{page.title}}
      </div>
    </DocfyPreviousOrNextPage>`;

  test('it returns next page when current url is first item', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/introduction');

    await render(template);

    assert.dom('[data-test-id="title"]').hasText('Installation');
  });

  test('it does not return next page when current url is the last item', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon
      .stub(routerService, 'currentURL')
      .get(() => '/docs/core/helpers/genereate-flat-output');

    await render(template);

    assert.dom('[data-test-id="title"]').hasText('');
  });

  test('it returns previous page when current url is not first item', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/installation');

    this.set('isPrevious', true);
    await render(template);

    assert.dom('[data-test-id="title"]').hasText('Introduction');
  });

  test('it does not return previous page when current url is first item', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/introduction');

    this.set('isPrevious', true);
    await render(template);

    assert.dom('[data-test-id="title"]').hasText('');
  });

  test('it returns next page when next page is under another scope', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/overview');

    await render(template);

    assert.dom('[data-test-id="title"]').hasText('Installation');
  });

  test('it returns previus page when previus page is under another scope', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/core/overview');

    this.set('isPrevious', true);
    await render(template);

    assert.dom('[data-test-id="title"]').hasText('Docfy Link Component');
  });
});
