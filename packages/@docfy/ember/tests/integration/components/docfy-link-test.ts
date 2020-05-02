import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import output from '@docfy/ember/output';
import sinon from 'sinon';

module('Integration | Component | DocfyLink', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    assert.expect(4);

    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'transitionTo').callsFake((routeName: string) => {
      assert.equal(routeName, 'docs.introduction');
    });

    this.set('page', output.flat[0]);

    await render(
      hbs`<DocfyLink @to={{this.page.url}} data-test-id="link" @activeClass="active">
            {{this.page.title}}
          </DocfyLink>`
    );
    assert
      .dom('[data-test-id="link"]')
      .hasAttribute('href', '/docs/introduction');

    assert.dom('[data-test-id="link"]').hasText('Introduction');
    assert.dom('[data-test-id="link"]').doesNotHaveClass('active');

    await click('[data-test-id="link"]');
    sinon.restore();
  });

  test('it adds active class when active', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();
    const routerService = this.owner.lookup('service:router');
    sinon
      .stub(routerService, 'currentRouteName')
      .get(() => 'docs.introduction');

    this.set('page', output.flat[0]);

    await render(
      hbs`<DocfyLink @to={{this.page.url}} data-test-id="link" @activeClass="active">
            {{this.page.title}}
          </DocfyLink>`
    );
    assert
      .dom('[data-test-id="link"]')
      .hasAttribute('href', '/docs/introduction');

    assert.dom('[data-test-id="link"]').hasClass('active');
    sinon.restore();
  });
});
