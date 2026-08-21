import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import DocfyLink from '@docfy/ember/components/docfy-link';
import type RouterService from '@ember/routing/router-service';

interface RouterStub {
  recognizeCalls: string[];
  transitions: string[];
}

/**
 * Replace the router service's URL-resolving surface.
 *
 * `recognize` is the interesting one: under Embroider's `splitAtRoutes` it
 * resolves the target route, which fetches that route's bundle. These tests
 * assert it is never reached while rendering.
 */
function stubRouter(
  owner: { lookup(name: string): unknown },
  { currentURL = '/docs/other', recognizes = true } = {}
): RouterStub {
  const router = owner.lookup('service:router') as RouterService;
  const stub: RouterStub = { recognizeCalls: [], transitions: [] };

  Object.defineProperty(router, 'currentURL', {
    value: currentURL,
    configurable: true,
  });
  Object.defineProperty(router, 'rootURL', { value: '/', configurable: true });

  router.recognize = ((url: string) => {
    stub.recognizeCalls.push(url);
    return recognizes ? ({ name: 'docs.configuration' } as never) : undefined;
  }) as RouterService['recognize'];

  router.transitionTo = ((url: string) => {
    stub.transitions.push(url);
    return undefined as never;
  }) as RouterService['transitionTo'];

  return stub;
}

module('Integration | Component | DocfyLink', function (hooks) {
  setupRenderingTest(hooks);

  test('the href comes from @to, without resolving the route', async function (assert) {
    const router = stubRouter(this.owner);

    await render(
      <template>
        <DocfyLink @to="/docs/configuration">Config</DocfyLink>
      </template>
    );

    assert
      .dom('[data-test-docfy-link]')
      .hasAttribute('href', '/docs/configuration');
    assert.deepEqual(
      router.recognizeCalls,
      [],
      'recognize() is not called while rendering'
    );
  });

  test('an index page URL does not render a trailing slash', async function (assert) {
    stubRouter(this.owner);

    // Docfy gives index pages a trailing slash; urlFor never produced one.
    await render(
      <template>
        <DocfyLink @to="/docs/getting-started/">Start</DocfyLink>
      </template>
    );

    assert
      .dom('[data-test-docfy-link]')
      .hasAttribute('href', '/docs/getting-started');
  });

  test('an anchor is appended to the href', async function (assert) {
    stubRouter(this.owner);

    await render(
      <template>
        <DocfyLink
          @to="/docs/configuration"
          @anchor="urlschema"
        >Schema</DocfyLink>
      </template>
    );

    assert
      .dom('[data-test-docfy-link]')
      .hasAttribute('href', '/docs/configuration#urlschema');
  });

  test('active state is derived from the current URL', async function (assert) {
    const router = stubRouter(this.owner, {
      currentURL: '/docs/configuration',
    });

    await render(
      <template>
        <DocfyLink @to="/docs/configuration" @activeClass="is-active">
          Config
        </DocfyLink>
      </template>
    );

    assert.dom('[data-test-docfy-link]').hasClass('is-active');
    assert
      .dom('[data-test-docfy-link]')
      .hasAttribute('data-test-is-active', 'true');
    assert.deepEqual(router.recognizeCalls, [], 'still no route resolution');
  });

  test('an index page is active when visited without its trailing slash', async function (assert) {
    stubRouter(this.owner, { currentURL: '/docs/getting-started' });

    await render(
      <template>
        <DocfyLink @to="/docs/getting-started/" @activeClass="is-active">
          Start
        </DocfyLink>
      </template>
    );

    assert.dom('[data-test-docfy-link]').hasClass('is-active');
  });

  test('an unrelated current URL is not active', async function (assert) {
    stubRouter(this.owner);

    await render(
      <template>
        <DocfyLink @to="/docs/configuration" @activeClass="is-active">
          Config
        </DocfyLink>
      </template>
    );

    assert.dom('[data-test-docfy-link]').doesNotHaveClass('is-active');
  });

  test('clicking resolves the route and transitions', async function (assert) {
    const router = stubRouter(this.owner);

    await render(
      <template>
        <DocfyLink @to="/docs/configuration">Config</DocfyLink>
      </template>
    );
    await click('[data-test-docfy-link]');

    assert.deepEqual(
      router.recognizeCalls,
      ['/docs/configuration'],
      'resolved on click, not on render'
    );
    assert.deepEqual(router.transitions, ['/docs/configuration']);
  });

  test('an unrecognised @to is left to the browser', async function (assert) {
    const router = stubRouter(this.owner, { recognizes: false });

    await render(
      <template>
        <DocfyLink @to="/not-a-page">Nope</DocfyLink>
      </template>
    );
    await click('[data-test-docfy-link]');

    assert.deepEqual(router.transitions, [], 'no transition is attempted');
  });
});
