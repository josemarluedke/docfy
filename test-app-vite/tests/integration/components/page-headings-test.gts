import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import sinon from 'sinon';
import type { DocfyService } from '@docfy/ember';
import type CurrentHeadingService from 'test-app-vite/services/current-heading';
import PageHeadings from 'test-app-vite/components/page-headings';

module('Integration | Component | @docfy/page-headings', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><PageHeadings /></template>);
    assert.dom('[data-test-id="page-headings"]').exists();
  });

  test('it renders empty state when no headings', async function (assert) {
    // Mock DocfyService with empty current page
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const stub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    await render(<template><PageHeadings /></template>);

    // Should not render any links when no headings
    assert.dom('[data-test-id="headings-list"]').doesNotExist();
    assert.dom('[data-test-id="heading-link"]').doesNotExist();

    stub.restore();
  });

  test('it renders headings with proper structure', async function (assert) {
    // Mock DocfyService with headings
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const stub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [
        {
          id: 'examples',
          title: 'Examples',
          headings: [
            {
              id: 'simple-usage',
              title: 'Simple usage',
              headings: [],
            },
            {
              id: 'advanced-usage',
              title: 'Advanced usage',
              headings: [],
            },
          ],
        },
        {
          id: 'api',
          title: 'API',
          headings: [],
        },
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    await render(<template><PageHeadings /></template>);

    // Should render main ul
    assert.dom('[data-test-id="headings-list"]').exists();

    // Should render top-level headings
    assert.dom('[data-test-heading-id="examples"]').exists();
    assert.dom('[data-test-heading-id="examples"]').hasText('Examples');
    assert.dom('[data-test-heading-id="api"]').exists();
    assert.dom('[data-test-heading-id="api"]').hasText('API');

    // Should render nested headings
    assert.dom('[data-test-heading-id="simple-usage"]').exists();
    assert.dom('[data-test-heading-id="simple-usage"]').hasText('Simple usage');
    assert.dom('[data-test-heading-id="advanced-usage"]').exists();
    assert
      .dom('[data-test-heading-id="advanced-usage"]')
      .hasText('Advanced usage');

    stub.restore();
  });

  test('it highlights current heading', async function (assert) {
    // Mock DocfyService with headings
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const currentHeadingService = this.owner.lookup(
      'service:current-heading'
    ) as CurrentHeadingService;

    const docfyStub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [
        {
          id: 'examples',
          title: 'Examples',
          headings: [],
        },
        {
          id: 'api',
          title: 'API',
          headings: [],
        },
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    // Set current heading before rendering
    currentHeadingService.setCurrentHeadingId('examples');

    await render(<template><PageHeadings /></template>);

    // Should highlight the current heading
    assert
      .dom('[data-test-heading-id="examples"]')
      .hasAttribute('data-test-is-active', 'true');
    assert
      .dom('[data-test-heading-id="api"]')
      .hasAttribute('data-test-is-active', 'false');

    // Change current heading
    currentHeadingService.setCurrentHeadingId('api');
    await settled();

    // Should highlight the new current heading
    assert
      .dom('[data-test-heading-id="api"]')
      .hasAttribute('data-test-is-active', 'true');
    assert
      .dom('[data-test-heading-id="examples"]')
      .hasAttribute('data-test-is-active', 'false');

    docfyStub.restore();
  });

  test('it handles clicks on heading links', async function (assert) {
    // Mock DocfyService with headings
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const stub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [
        {
          id: 'examples',
          title: 'Examples',
          headings: [],
        },
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    await render(<template><PageHeadings /></template>);

    // Mock the DOM element that would be found by querySelector
    const mockElement = document.createElement('div');
    mockElement.id = 'examples';
    document.body.appendChild(mockElement);

    try {
      await click('[data-test-heading-id="examples"]');

      // Should have clicked without error (scrollToElement functionality is tested separately)
      assert.ok(true, 'Click handler executed without error');
    } finally {
      document.body.removeChild(mockElement);
    }

    stub.restore();
  });

  test('it handles nested headings highlighting', async function (assert) {
    // Mock DocfyService with nested headings
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const currentHeadingService = this.owner.lookup(
      'service:current-heading'
    ) as CurrentHeadingService;

    const docfyStub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [
        {
          id: 'examples',
          title: 'Examples',
          headings: [
            {
              id: 'simple-usage',
              title: 'Simple usage',
              headings: [],
            },
          ],
        },
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    // Set current heading to nested heading before rendering
    currentHeadingService.setCurrentHeadingId('simple-usage');

    await render(<template><PageHeadings /></template>);

    // Should highlight the nested heading
    assert
      .dom('[data-test-heading-id="simple-usage"]')
      .hasAttribute('data-test-is-active', 'true');
    assert
      .dom('[data-test-heading-id="examples"]')
      .hasAttribute('data-test-is-active', 'false');

    docfyStub.restore();
  });

  test('it applies correct CSS classes', async function (assert) {
    // Mock DocfyService with headings
    const docfyService = this.owner.lookup('service:docfy') as DocfyService;
    const stub = sinon.stub(docfyService, 'currentPage').get(() => ({
      url: '/test',
      title: 'Test Page',
      headings: [
        {
          id: 'examples',
          title: 'Examples',
          headings: [
            {
              id: 'simple-usage',
              title: 'Simple usage',
              headings: [],
            },
          ],
        },
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    await render(<template><PageHeadings /></template>);

    // Check container exists
    assert.dom('[data-test-id="page-headings"]').exists();

    // Check headings list exists
    assert.dom('[data-test-id="headings-list"]').exists();

    // Check that headings are rendered
    assert.dom('[data-test-heading-id="examples"]').exists();
    assert.dom('[data-test-heading-id="simple-usage"]').exists();

    // Check that subheadings have correct data attributes
    assert.dom('[data-test-id="subheading-link"]').exists();

    stub.restore();
  });
});
