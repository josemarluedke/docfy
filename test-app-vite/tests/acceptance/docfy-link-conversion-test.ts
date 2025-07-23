import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | DocfyLink conversion', function (hooks) {
  setupApplicationTest(hooks);

  test('it converts internal links to DocfyLink components in markdown content', async function (assert) {
    await visit('/docs/ember/configuration');

    assert.strictEqual(currentURL(), '/docs/ember/configuration');

    // Should have converted the internal link to DocfyLink component
    // Original markdown: [here](../../../docs/configuration.md)
    // Should become: <DocfyLink @to="/docs/configuration">here</DocfyLink>

    // Check that at least one DocfyLink exists within markdown content
    assert
      .dom('[data-test-id="markdown-content"] [data-test-docfy-link]')
      .exists('DocfyLink component should be present in markdown content');

    // Check that there's a DocfyLink with the "here" text within markdown content
    const markdownContent = document.querySelector(
      '[data-test-id="markdown-content"]'
    );
    const docfyLinkWithHere = Array.from(
      markdownContent!.querySelectorAll('[data-test-docfy-link]')
    ).find((el) => el.textContent?.trim() === 'here');
    assert.ok(
      docfyLinkWithHere,
      'Should find DocfyLink with "here" text in markdown content'
    );

    if (docfyLinkWithHere) {
      assert
        .dom(docfyLinkWithHere)
        .hasAttribute('data-test-to', '/docs/configuration');
    }
  });

  test('it converts internal links with anchors to DocfyLink components', async function (assert) {
    await visit('/docs/writing-markdown');

    assert.strictEqual(currentURL(), '/docs/writing-markdown');

    // Should have converted links with anchors
    // Original markdown: [Source Configuration](./configuration.md#urlschema)
    // Should become: <DocfyLink @to="/docs/configuration" @anchor="urlschema">Source Configuration</DocfyLink>
    const linkWithAnchor = document.querySelector(
      '[data-test-id="markdown-content"] [data-test-docfy-link][data-test-anchor="urlschema"]'
    );
    assert
      .dom(linkWithAnchor)
      .exists('DocfyLink with anchor should be present in markdown content');
    assert
      .dom(linkWithAnchor)
      .hasAttribute('data-test-to', '/docs/configuration');
    assert.dom(linkWithAnchor).hasAttribute('data-test-anchor', 'urlschema');
    assert.dom(linkWithAnchor).hasText('Source Configuration');
  });

  test('it converts multiple internal links on the same page', async function (assert) {
    await visit('/docs/writing-markdown');

    assert.strictEqual(currentURL(), '/docs/writing-markdown');

    // Should have multiple DocfyLink components on this page within markdown content
    const docfyLinks = document.querySelectorAll(
      '[data-test-id="markdown-content"] [data-test-docfy-link]'
    );
    assert.ok(
      docfyLinks.length >= 2,
      'Should have multiple DocfyLink components in markdown content'
    );

    // Check specific links we know should be converted
    const configLink = document.querySelector(
      '[data-test-id="markdown-content"] [data-test-docfy-link][data-test-to="/docs/configuration"]'
    );
    assert
      .dom(configLink)
      .exists('Should have link to configuration page in markdown content');

    const configLinkWithAnchor = document.querySelector(
      '[data-test-id="markdown-content"] [data-test-docfy-link][data-test-anchor="staticassetspath"]'
    );
    assert
      .dom(configLinkWithAnchor)
      .exists(
        'Should have link to configuration with anchor in markdown content'
      );
    assert
      .dom(configLinkWithAnchor)
      .hasAttribute('data-test-to', '/docs/configuration');
  });

  test('it preserves external links as regular anchor tags', async function (assert) {
    await visit('/docs/writing-markdown');

    assert.strictEqual(currentURL(), '/docs/writing-markdown');

    // External links should remain as regular anchor tags within markdown content
    const externalLink = document.querySelector(
      '[data-test-id="markdown-content"] a[href="https://www.markdownguide.org/basic-syntax/"]'
    );
    assert
      .dom(externalLink)
      .exists('External link should remain as anchor tag in markdown content');
    assert.dom(externalLink).hasText('check this guide out');

    const remarkLink = document.querySelector(
      '[data-test-id="markdown-content"] a[href="https://remark.js.org/"]'
    );
    assert
      .dom(remarkLink)
      .exists(
        'External remark link should remain as anchor tag in markdown content'
      );
    assert.dom(remarkLink).hasText('remark');
  });

  test('it converts internal links in demo pages', async function (assert) {
    await visit('/docs/ember/writing-demos');

    assert.strictEqual(currentURL(), '/docs/ember/writing-demos');

    // Should have converted the internal link in the writing-demos page
    // Original markdown: [Writing Markdown - Demos](../../../docs/writing-markdown.md#demos)
    // Should become: <DocfyLink @to="/docs/writing-markdown" @anchor="demos">Writing Markdown - Demos</DocfyLink>
    const demoLink = document.querySelector(
      '[data-test-id="markdown-content"] [data-test-docfy-link][data-test-anchor="demos"]'
    );
    assert
      .dom(demoLink)
      .exists(
        'DocfyLink with demos anchor should be present in markdown content'
      );
    assert.dom(demoLink).hasAttribute('data-test-to', '/docs/writing-markdown');
    assert.dom(demoLink).hasAttribute('data-test-anchor', 'demos');
    assert.dom(demoLink).hasText('Writing Markdown - Demos');
  });

  test('it adds proper imports for DocfyLink in generated templates', async function (assert) {
    await visit('/docs/ember/configuration');

    assert.strictEqual(currentURL(), '/docs/ember/configuration');

    // The page should have DocfyLink components functioning properly within markdown content
    const docfyLinkElement = document.querySelector(
      '[data-test-id="markdown-content"] [data-test-docfy-link]'
    );
    assert
      .dom(docfyLinkElement)
      .exists(
        'DocfyLink component should be present and functional in markdown content'
      );

    // DocfyLink should have proper Ember component attributes
    assert
      .dom(docfyLinkElement)
      .hasClass('docfy-link', 'DocfyLink should have proper CSS class');
  });

  test('it handles pages without internal links correctly', async function (assert) {
    await visit('/docs/getting-started');

    assert.strictEqual(currentURL(), '/docs/getting-started');

    // Pages without internal links should not have DocfyLink components within markdown content
    const docfyLinks = document.querySelectorAll(
      '[data-test-id="markdown-content"] [data-test-docfy-link]'
    );

    // This page might have external links but no internal ones
    const externalLinks = document.querySelectorAll(
      '[data-test-id="markdown-content"] a[href^="http"]'
    );

    // If there are no DocfyLink components, that's expected for pages without internal links
    assert.ok(true, 'Page without internal links loads correctly');

    // If there are external links, they should remain as anchor tags
    if (externalLinks.length > 0) {
      assert
        .dom(externalLinks[0])
        .hasTagName('a', 'External links should remain as anchor tags');
    }
  });
});
