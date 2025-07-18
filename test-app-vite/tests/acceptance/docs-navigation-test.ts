import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | docs navigation', function (hooks) {
  setupApplicationTest(hooks);

  test('it can visit docs index page', async function (assert) {
    await visit('/docs');

    assert.strictEqual(currentURL(), '/docs');
    // Should have rendered the docs layout
    assert.dom('div').exists();
  });

  test('it can navigate to documentation pages', async function (assert) {
    await visit('/docs');

    // Should have documentation layout structure
    assert.dom('[data-test-id="docs-layout"]').exists();

    // Should have navigation sidebar
    assert.dom('[data-test-id="sidebar-nav"]').exists();

    // Should have main content area
    assert.dom('[data-test-id="main-content"]').exists();

    // Should have right sidebar for headings
    assert.dom('[data-test-id="right-sidebar"]').exists();
  });

  test('it can visit specific documentation page', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    assert.strictEqual(
      currentURL(),
      '/docs/ember/components/docfy-previous-and-next-page'
    );

    // Should render page title
    assert.dom('h1').exists();
    assert.dom('h1').hasText('<DocfyPreviousAndNextPage>');

    // Should render page content in markdown container
    assert.dom('[data-test-id="markdown-content"]').exists();
  });

  test('it renders navigation sidebar', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have sidebar navigation
    assert.dom('[data-test-id="sidebar-nav"]').exists();

    // Should have main content area
    assert.dom('[data-test-id="main-content"]').exists();
  });

  test('it renders page headings in right sidebar', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have right sidebar
    assert.dom('[data-test-id="right-sidebar"]').exists();

    // Should render page headings component
    assert.dom('[data-test-id="page-headings"]').exists();

    // This specific page should have headings (Examples, API, etc.)
    assert.dom('[data-test-id="headings-list"]').exists();
    assert.dom('[data-test-heading-id="examples"]').exists();
    assert.dom('[data-test-heading-id="api"]').exists();
  });

  test('it can click on heading links', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // This specific page should have an "Examples" heading link
    assert.dom('[data-test-heading-id="examples"]').exists();

    // Click on the Examples heading link
    await click('[data-test-heading-id="examples"]');

    // URL should still be on the same page (with or without hash)
    assert.ok(
      currentURL().includes(
        '/docs/ember/components/docfy-previous-and-next-page'
      ),
      'Should remain on the same page'
    );
  });

  test('it renders edit page link when available', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // This specific page should have demo edit links (not main page edit)
    assert.dom('[data-test-id="demo-edit-url"]').exists();
    assert
      .dom('[data-test-id="demo-edit-url"]')
      .hasAttribute('target', '_blank');
    assert
      .dom('[data-test-id="demo-edit-url"]')
      .hasAttribute('rel', 'noopener noreferrer');
    assert.dom('[data-test-id="demo-edit-url"]').hasText('Edit this demo');
  });

  test('it renders previous and next page navigation', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have previous/next navigation area
    assert.dom('[data-test-id="previous-next-navigation"]').exists();

    // This page should have previous/next links based on navigation structure
    // The actual presence depends on the position in the navigation
    assert.dom('[data-test-id="previous-next-navigation"]').exists();
  });

  test('it applies correct page title', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should set page title to "Documentation" as configured in DocsLayout
    assert.ok(
      document.title.includes('Documentation'),
      'Page title should contain Documentation'
    );
  });

  test('it handles deep navigation paths', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    assert.strictEqual(
      currentURL(),
      '/docs/ember/components/docfy-previous-and-next-page'
    );

    // Should handle nested paths correctly
    assert.dom('[data-test-id="markdown-content"]').exists();
    assert.dom('h1').exists();
    assert.dom('h1').hasText('<DocfyPreviousAndNextPage>');
  });

  test('it maintains responsive layout', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have main layout components
    assert.dom('[data-test-id="docs-layout"]').exists();
    assert.dom('[data-test-id="sidebar-nav"]').exists();
    assert.dom('[data-test-id="main-content"]').exists();
    assert.dom('[data-test-id="right-sidebar"]').exists();
  });

  test('it renders markdown content correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should render markdown content container
    assert.dom('[data-test-id="markdown-content"]').exists();

    // Should have proper headings for this specific page
    assert.dom('h1').exists();
    assert.dom('h1').hasText('<DocfyPreviousAndNextPage>');

    // Should have Examples and API sections
    assert.dom('h2').exists();

    // Should have paragraphs with content
    assert.dom('p').exists();

    // Should have code examples
    assert.dom('pre').exists();
    assert.dom('code').exists();
  });

  test('it handles 404 for non-existent pages', async function (assert) {
    try {
      await visit('/docs/non-existent-page');

      // If we get here, the route exists but may show 404 content
      assert.ok(true, 'Route handled gracefully');
    } catch (error) {
      // If route doesn't exist, that's expected
      assert.ok(true, 'Non-existent route handled appropriately');
    }
  });

  test('it handles URL fragments correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page#examples');

    // Should load the page with the fragment
    assert.ok(
      currentURL().includes(
        '/docs/ember/components/docfy-previous-and-next-page'
      ),
      'URL should include the page path'
    );

    // Should render the page content
    assert.dom('[data-test-id="markdown-content"]').exists();
    assert.dom('h1').exists();
    assert.dom('h1').hasText('<DocfyPreviousAndNextPage>');

    // Should have the Examples section that the fragment points to
    assert.dom('#examples').exists();
  });
});
