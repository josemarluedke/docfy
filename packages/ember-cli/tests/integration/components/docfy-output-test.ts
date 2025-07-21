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
        @fromCurrentURL={{this.fromCurrentURL}}
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
        '/docs/ /docs/introduction /docs/installation /docs/overview /docs/core/overview /docs/core/helpers/genereate-flat-output /docs/core/helpers/genereate-nested-output /docs/ember-cli/ /docs/ember-cli/installation /docs/ember-cli/components/docfy-link /docs/ember-cli/components/docfy-output /docs/ember-cli/components/docfy-with-hyphenated-number-2 /docs/ember-cli/plugins/manual-demo-insertion'
      );
  });

  test('it returns the page by url', async function (assert) {
    this.set('url', '/docs/overview');
    await render(template);

    assert.dom('[data-test-id="flat-url-title"]').hasText('Overview');
  });

  test('it returns the page by url when url is index', async function (assert) {
    this.set('url', '/docs/ember-cli');
    await render(template);

    assert.dom('[data-test-id="flat-url-title"]').hasText('Working with Ember');
  });

  test('it returns the page fromCurrentURL', async function (assert) {
    const router = this.owner.lookup('router:main');
    // @ts-ignore
    router.setupRouter();

    const routerService = this.owner.lookup('service:router');
    // @ts-ignore
    sinon.stub(routerService, 'currentURL').get(() => '/docs/installation');
    this.set('fromCurrentURL', true);
    await render(template);

    assert.dom('[data-test-id="flat-url-title"]').hasText('Installation');
  });
});
