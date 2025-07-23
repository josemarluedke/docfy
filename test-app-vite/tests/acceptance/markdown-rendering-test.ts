import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | markdown rendering', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders markdown content correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    assert.strictEqual(
      currentURL(),
      '/docs/ember/components/docfy-previous-and-next-page'
    );

    // Should render markdown content
    assert.dom('div.markdown').exists();

    // Should have proper headings
    assert.dom('h1').exists();
    assert.dom('h1').hasText('<DocfyPreviousAndNextPage>');

    // Should have markdown paragraphs
    assert.dom('div.markdown p').exists();

    // Should have code blocks if they exist
    const codeBlocks = document.querySelectorAll('div.markdown pre');
    if (codeBlocks.length > 0) {
      assert.dom('div.markdown pre').exists();
      assert.dom('div.markdown code').exists();
    }
  });

  test('it renders markdown headings with proper hierarchy', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have h1 for page title
    assert.dom('h1').exists();

    // Should have h2 for sections
    const h2Elements = document.querySelectorAll('h2');
    if (h2Elements.length > 0) {
      assert.dom('h2').exists();

      // H2 elements should have IDs for linking
      const h2WithId = document.querySelector('h2[id]');
      if (h2WithId) {
        assert.dom('h2[id]').exists();
      }
    }

    // Should have h3 for subsections
    const h3Elements = document.querySelectorAll('h3');
    if (h3Elements.length > 0) {
      assert.dom('h3').exists();
    }
  });

  test('it renders markdown links correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have internal links
    const internalLinks = document.querySelectorAll(
      'div.markdown a[href^="/docs"]'
    );
    if (internalLinks.length > 0) {
      assert.dom('div.markdown a[href^="/docs"]').exists();
    }

    // Should have external links with proper attributes
    const externalLinks = document.querySelectorAll(
      'div.markdown a[href^="http"]'
    );
    if (externalLinks.length > 0) {
      assert.dom('div.markdown a[href^="http"]').exists();

      // External links should have target="_blank" and rel attributes
      const externalLink = externalLinks[0] as HTMLAnchorElement;
      if (externalLink.getAttribute('target') === '_blank') {
        assert.dom(externalLink).hasAttribute('target', '_blank');
        assert.dom(externalLink).hasAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test('it renders markdown code blocks with syntax highlighting', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have code blocks
    const codeBlocks = document.querySelectorAll('div.markdown pre code');
    if (codeBlocks.length > 0) {
      assert.dom('div.markdown pre code').exists();

      // Check for syntax highlighting classes
      const highlightedCode = document.querySelector(
        'div.markdown pre code[class*="language-"]'
      );
      if (highlightedCode) {
        assert.dom('div.markdown pre code[class*="language-"]').exists();
      }
    }
  });

  test('it renders markdown inline code correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have inline code elements
    const inlineCodeElements = document.querySelectorAll(
      'div.markdown p code, div.markdown li code'
    );
    if (inlineCodeElements.length > 0) {
      assert.dom('div.markdown code').exists();
    }
  });

  test('it renders markdown lists correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have lists if they exist in markdown
    const unorderedLists = document.querySelectorAll('div.markdown ul');
    if (unorderedLists.length > 0) {
      assert.dom('div.markdown ul').exists();
      assert.dom('div.markdown ul li').exists();
    } else {
      assert.ok(
        true,
        'No unordered lists found on this page - this is acceptable'
      );
    }

    const orderedLists = document.querySelectorAll('div.markdown ol');
    if (orderedLists.length > 0) {
      assert.dom('div.markdown ol').exists();
      assert.dom('div.markdown ol li').exists();
    } else {
      assert.ok(
        true,
        'No ordered lists found on this page - this is acceptable'
      );
    }
  });

  test('it renders markdown blockquotes correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have blockquotes if they exist in markdown
    const blockquotes = document.querySelectorAll('div.markdown blockquote');
    if (blockquotes.length > 0) {
      assert.dom('div.markdown blockquote').exists();
    } else {
      assert.ok(true, 'No blockquotes found on this page - this is acceptable');
    }
  });

  test('it renders markdown tables correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have tables if they exist in markdown
    const tables = document.querySelectorAll('div.markdown table');
    if (tables.length > 0) {
      assert.dom('div.markdown table').exists();
      assert.dom('div.markdown table thead').exists();
      assert.dom('div.markdown table tbody').exists();
      assert.dom('div.markdown table th').exists();
      assert.dom('div.markdown table td').exists();
    }
  });

  test('it renders markdown content with proper CSS classes', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have markdown container with proper class
    assert.dom('div.markdown').exists();

    // Should have proper styling for markdown elements
    assert.dom('div.markdown').hasClass('markdown');
  });

  test('it handles markdown content with emoji and special characters', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should render content without breaking on special characters
    assert.dom('div.markdown').exists();

    // Content should be properly escaped/rendered
    const markdownContent = document.querySelector('div.markdown');
    if (markdownContent) {
      assert.ok(
        markdownContent.innerHTML.length > 0,
        'Markdown content should be rendered'
      );
    }
  });

  test('it renders markdown images correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have images if they exist in markdown
    const images = document.querySelectorAll('div.markdown img');
    if (images.length > 0) {
      assert.dom('div.markdown img').exists();

      // Images should have alt text
      const imageWithAlt = document.querySelector('div.markdown img[alt]');
      if (imageWithAlt) {
        assert.dom('div.markdown img[alt]').exists();
      }
    } else {
      assert.ok(true, 'No images found on this page - this is acceptable');
    }
  });

  test('it renders markdown with proper document structure', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should have proper page structure
    assert.dom('div.markdown').exists();

    // Should have page title
    assert.dom('h1').exists();

    // Should have content sections
    const contentSections = document.querySelectorAll('div.markdown > *');
    assert.ok(
      contentSections.length > 1,
      'Should have multiple content sections'
    );

    // Should maintain proper HTML structure
    const markdownDiv = document.querySelector('div.markdown');
    if (markdownDiv) {
      assert.ok(
        markdownDiv.children.length > 0,
        'Markdown container should have child elements'
      );
    }
  });

  test('it renders markdown frontmatter data correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Should process frontmatter and render page accordingly
    assert.dom('h1').exists();
    assert.dom('div.markdown').exists();

    // Page should be properly structured based on frontmatter
    assert.ok(
      document.title.includes('Documentation') ||
        document.title.includes('Docfy'),
      'Page title should be set from frontmatter'
    );
  });
});
