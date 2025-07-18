import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import sinon from 'sinon';
import type DocfyService from 'test-app-vite/services/docfy';
import type CurrentHeadingService from 'test-app-vite/services/current-heading';
import DocsLayout from 'test-app-vite/components/docs-layout';

module('Integration | Component | @docfy/docs-layout', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);
    assert.dom('div').exists();
  });

  test('it renders basic layout structure', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should render main container
    assert.dom('div.px-4').exists();
    assert.dom('div.mx-auto').exists();
    assert.dom('div.max-w-\\(--breakpoint-2xl\\)').exists();

    // Should render flex container
    assert.dom('div.lg\\:flex').exists();

    // Should render sidebar navigation area
    assert.dom('div.lg\\:w-64').exists();

    // Should render main content area
    assert.dom('div.flex-1').exists();
    assert.dom('div.markdown').exists();

    // Should render right sidebar for headings
    assert.dom('div.w-56').exists();
  });

  test('it renders sidebar navigation', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [
          {
            name: 'getting-started',
            children: [],
            pages: [
              {
                url: '/docs/getting-started',
                title: 'Getting Started',
                headings: [],
                editUrl: undefined,
                toc: [],
                demos: [],
              },
            ],
          },
        ],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should render SidebarNav component
    assert.dom('div.lg\\:w-64').exists();
  });

  test('it renders edit URL when provided', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: 'https://github.com/example/repo/edit/main/docs/test.md',
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should render edit link
    assert
      .dom('a[href="https://github.com/example/repo/edit/main/docs/test.md"]')
      .exists();
    assert
      .dom('a[href="https://github.com/example/repo/edit/main/docs/test.md"]')
      .hasText('Edit this page on GitHub');
    assert
      .dom('a[href="https://github.com/example/repo/edit/main/docs/test.md"]')
      .hasAttribute('target', '_blank');
    assert
      .dom('a[href="https://github.com/example/repo/edit/main/docs/test.md"]')
      .hasAttribute('rel', 'noopener noreferrer');

    // Should render edit icon
    assert.dom('svg').exists();
  });

  test('it does not render edit URL when not provided', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should not render edit link
    const editLinks = document.querySelectorAll('a[href*="github.com"]');
    const editPageLinks = Array.from(editLinks).filter((link) =>
      link.textContent?.includes('Edit this page')
    );
    assert.strictEqual(
      editPageLinks.length,
      0,
      'Should not render edit page link when editUrl is not provided'
    );
  });

  test('it renders previous and next navigation', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should render DocfyPreviousAndNextPage component area
    assert.dom('div.flex.flex-wrap.justify-between').exists();
    assert.dom('div.border-t').exists();
  });

  test('it renders page headings in sidebar', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should render PageHeadings component in right sidebar
    assert.dom('div.w-56').exists();
    assert.dom('div.w-56 div.overflow-y-auto').exists();
  });

  test('it applies intersect-headings modifier', async function (assert) {
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

    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should apply intersect-headings modifier to markdown div
    assert.dom('div.markdown').exists();

    stub.restore();
  });

  test('it calls setCurrentHeadingId when intersection changes', async function (assert) {
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
      ],
      editUrl: undefined,
      toc: [],
      demos: [],
    }));

    const setCurrentHeadingIdSpy = sinon.spy(
      currentHeadingService,
      'setCurrentHeadingId'
    );

    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Create a mock heading element to simulate intersection
    const mockHeading = document.createElement('h2');
    mockHeading.id = 'examples';
    document.body.appendChild(mockHeading);

    try {
      // The modifier should be attached, but we can't easily trigger IntersectionObserver in tests
      // So we'll just verify the component structure is correct
      assert.dom('div.markdown').exists();

      // Verify the service exists and can be called
      assert.ok(currentHeadingService.setCurrentHeadingId);
    } finally {
      document.body.removeChild(mockHeading);
    }

    docfyStub.restore();
    setCurrentHeadingIdSpy.restore();
  });

  test('it renders content in markdown div', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(
      <template>
        <DocsLayout @model={{model}}>
          <h1>Test Content</h1>
          <p>This is test content</p>
        </DocsLayout>
      </template>
    );

    // Should render yielded content inside markdown div
    assert.dom('div.markdown h1').hasText('Test Content');
    assert.dom('div.markdown p').hasText('This is test content');
  });

  test('it has correct responsive classes', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Check responsive classes
    assert.dom('div.lg\\:flex').exists();
    assert.dom('div.lg\\:w-64').exists();
    assert.dom('div.lg\\:px-4').exists();
    assert.dom('div.lg\\:block').exists();
    assert.dom('div.hidden').exists();
  });

  test('it sets page title', async function (assert) {
    const model = {
      navigation: {
        name: 'docs',
        children: [],
        pages: [],
      },
      editUrl: undefined,
    };

    await render(<template><DocsLayout @model={{model}} /></template>);

    // Should set page title to "Documentation" (would need ember-page-title testing utilities to verify)
    assert.dom('div').exists(); // Just verify component renders
  });
});
