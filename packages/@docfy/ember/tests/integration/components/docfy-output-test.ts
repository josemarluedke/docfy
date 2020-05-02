import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | DocfyOutput', function (hooks) {
  setupRenderingTest(hooks);

  const template = hbs`
      <DocfyOutput
        @type={{this.type}}
        @fromActiveRoute={{this.fromActiveRoute}}
        @url={{this.url}}
        @scope={{this.scope}}
        as |result|
      >
        <div data-test-id="flat-url-title">
          {{result.title}}
        </div>
        <div data-test-id="nested-name">
          {{result.name}}
        </div>
        <div data-test-id="flat-urls">
          {{#each result as |item|}}
            {{item.url}}
          {{/each}}
        </div>

      </DocfyOutput>`;

  test('it returns the root nested object by default', async function (assert) {
    await render(template);

    assert.dom('[data-test-id="nested-name"]').hasText('/');
  });

  test('it returns the specified scope', async function (assert) {
    this.set('scope', 'docs');
    await render(template);

    assert.dom('[data-test-id="nested-name"]').hasText('docs');
  });

  test('it returns flat obj', async function (assert) {
    this.set('type', 'flat');
    await render(template);

    assert
      .dom('[data-test-id="flat-urls"]')
      .hasText(
        '/docs/introduction /docs/installation /docs/overview /docs/core/overview /docs/core/helpers/genereate-flat-output /docs/core/helpers/genereate-nested-output /docs/ember/installation /docs/ember/components/docfy-link /docs/ember/components/docfy-output'
      );
  });

  test('it returns the page by url', async function (assert) {
    this.set('url', '/docs/overview');
    await render(template);

    assert.dom('[data-test-id="flat-url-title"]').hasText('Overview');
  });

  test('it returns the page fromActiveRoute', async function (assert) {
    const router = this.owner.lookup('router:main');
    router.setupRouter();

    const routerService = this.owner.lookup('service:router');
    sinon.stub(routerService, 'currentURL').get(() => '/docs/installation');
    this.set('fromActiveRoute', true);
    await render(template);

    assert.dom('[data-test-id="flat-url-title"]').hasText('Installation');
  });
});
