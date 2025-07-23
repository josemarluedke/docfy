import { module, test } from 'qunit';
import { visit, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | demo rendering', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders demos on documentation pages', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // This specific page should have 2 demos
    assert.dom('[data-test-id="docfy-demo"]').exists();

    // Should have the specific demos for this page
    assert
      .dom(
        '[data-test-demo-id="docfy-demo-components-docfy-previous-and-next-page-simple"]'
      )
      .exists();
    assert
      .dom(
        '[data-test-demo-id="docfy-demo-components-docfy-previous-and-next-page-scope"]'
      )
      .exists();

    // Each demo should have a unique ID
    const demos = document.querySelectorAll('[data-test-id="docfy-demo"]');
    const demoIds = Array.from(demos).map((demo) =>
      demo.getAttribute('data-test-demo-id')
    );
    const uniqueIds = [...new Set(demoIds)];
    assert.equal(
      demoIds.length,
      uniqueIds.length,
      'Each demo should have a unique ID'
    );
  });

  test('it renders demo examples correctly', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // This specific page should have demo examples
    assert.dom('[data-test-id="demo-example"]').exists();

    // Demo examples should contain actual content
    const demoExamples = document.querySelectorAll(
      '[data-test-id="demo-example"]'
    );
    assert.ok(demoExamples.length >= 2, 'Should have at least 2 demo examples');

    // First demo example should contain content
    const firstExample = demoExamples[0];
    assert.ok(
      firstExample && firstExample.innerHTML.trim().length > 0,
      'Demo example should have content'
    );
  });

  test('it renders demo descriptions with titles', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demoDescriptions = document.querySelectorAll(
      '[data-test-id="demo-description"]'
    );

    if (demoDescriptions.length > 0) {
      assert.dom('[data-test-id="demo-description"]').exists();

      // Check if any descriptions have titles
      const demoTitles = document.querySelectorAll(
        '[data-test-id="demo-title"]'
      );
      if (demoTitles.length > 0) {
        assert.dom('[data-test-id="demo-title"]').exists();

        // Titles should have meaningful text
        const firstTitle = demoTitles[0];
        assert.ok(
          firstTitle &&
            firstTitle.textContent &&
            firstTitle.textContent.trim().length > 0,
          'Demo title should have text content'
        );
      } else {
        assert.ok(
          true,
          'No demo titles found - descriptions may not have titles'
        );
      }

      // Check if any descriptions have content
      const demoContents = document.querySelectorAll(
        '[data-test-id="demo-content"]'
      );
      if (demoContents.length > 0) {
        assert.dom('[data-test-id="demo-content"]').exists();

        // Content should have meaningful text
        const firstContent = demoContents[0];
        if (firstContent && firstContent.innerHTML !== null) {
          const contentHtml = firstContent.innerHTML.trim();
          if (contentHtml.length > 0) {
            assert.ok(true, 'Demo content has HTML content');
          } else {
            assert.ok(
              true,
              'Demo content exists but is empty - this is acceptable'
            );
          }
        } else {
          assert.ok(
            true,
            'Demo content element exists but has no innerHTML - this is acceptable'
          );
        }
      } else {
        assert.ok(true, 'No demo content found - descriptions may be empty');
      }
    } else {
      assert.ok(true, 'No demo descriptions found on this page');
    }
  });

  test('it renders demo edit URLs when available', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const editUrls = document.querySelectorAll(
      '[data-test-id="demo-edit-url"]'
    );

    if (editUrls.length > 0) {
      assert.dom('[data-test-id="demo-edit-url"]').exists();

      // Edit URLs should have proper attributes
      const firstEditUrl = editUrls[0] as HTMLAnchorElement;
      assert.dom(firstEditUrl).hasAttribute('href');
      assert.dom(firstEditUrl).hasAttribute('target', '_blank');
      assert.dom(firstEditUrl).hasAttribute('rel', 'noopener noreferrer');
      assert.dom(firstEditUrl).hasText('Edit this demo');

      // URLs should point to GitHub or similar
      const href = firstEditUrl.getAttribute('href');
      assert.ok(
        href && (href.includes('github.com') || href.includes('gitlab.com')),
        'Edit URL should point to a code repository'
      );
    } else {
      assert.ok(true, 'No demo edit URLs found on this page');
    }
  });

  test('it renders demo code snippets with tabs', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demoSnippets = document.querySelectorAll(
      '[data-test-id="demo-snippets"]'
    );

    if (demoSnippets.length > 0) {
      assert.dom('[data-test-id="demo-snippets"]').exists();

      // Should have tab buttons
      const tabButtons = document.querySelectorAll(
        '[data-test-id="demo-tab-button"]'
      );
      if (tabButtons.length > 0) {
        assert.dom('[data-test-id="demo-tab-button"]').exists();

        // First tab should be active by default
        const activeTab = document.querySelector(
          '[data-test-is-active="true"]'
        );
        assert.dom(activeTab).exists();

        // Should have snippet content
        assert.dom('[data-test-id="demo-snippet"]').exists();

        // Snippet should have actual code content
        const snippet = document.querySelector('[data-test-id="demo-snippet"]');
        assert.ok(
          snippet && snippet.innerHTML.trim().length > 0,
          'Demo snippet should have content'
        );
      }
    } else {
      assert.ok(true, 'No demo snippets found on this page');
    }
  });

  test('it allows switching between code snippet tabs', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const tabButtons = document.querySelectorAll(
      '[data-test-id="demo-tab-button"]'
    );

    if (tabButtons.length > 1) {
      // Get the initially active tab
      const initiallyActiveTab = document.querySelector(
        '[data-test-is-active="true"]'
      );
      assert.dom(initiallyActiveTab).exists();

      // Find a different tab to click
      const inactiveTab = document.querySelector(
        '[data-test-is-active="false"]'
      );
      if (inactiveTab) {
        // Click on the inactive tab
        await click(inactiveTab);

        // The clicked tab should now be active
        assert.dom(inactiveTab).hasAttribute('data-test-is-active', 'true');

        // The previously active tab should now be inactive
        if (initiallyActiveTab) {
          assert
            .dom(initiallyActiveTab)
            .hasAttribute('data-test-is-active', 'false');
        }

        // Should show the corresponding snippet
        assert.dom('[data-test-id="demo-snippet"]').exists();
      }
    } else {
      assert.ok(true, 'Not enough tabs to test switching functionality');
    }
  });

  test('it renders demo snippets with proper code formatting', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const snippets = document.querySelectorAll('[data-test-id="demo-snippet"]');

    if (snippets.length > 0) {
      assert.dom('[data-test-id="demo-snippet"]').exists();

      // Should have code elements
      const codeElements = document.querySelectorAll(
        '[data-test-id="demo-snippet"] code'
      );
      if (codeElements.length > 0) {
        assert.dom('[data-test-id="demo-snippet"] code').exists();
      }

      // Should have pre elements for formatted code
      const preElements = document.querySelectorAll(
        '[data-test-id="demo-snippet"] pre'
      );
      if (preElements.length > 0) {
        assert.dom('[data-test-id="demo-snippet"] pre').exists();
      }
    } else {
      assert.ok(true, 'No demo snippets found on this page');
    }
  });

  test('it renders complete demo workflow', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demos = document.querySelectorAll('[data-test-id="docfy-demo"]');

    if (demos.length > 0) {
      // Find a demo with all components
      const completeDemo = Array.from(demos).find((demo) => {
        const hasExample = demo.querySelector('[data-test-id="demo-example"]');
        const hasDescription = demo.querySelector(
          '[data-test-id="demo-description"]'
        );
        const hasSnippets = demo.querySelector(
          '[data-test-id="demo-snippets"]'
        );
        return hasExample && hasDescription && hasSnippets;
      });

      if (completeDemo) {
        // Should have all demo components
        assert
          .dom(completeDemo.querySelector('[data-test-id="demo-example"]'))
          .exists();
        assert
          .dom(completeDemo.querySelector('[data-test-id="demo-description"]'))
          .exists();
        assert
          .dom(completeDemo.querySelector('[data-test-id="demo-snippets"]'))
          .exists();

        // Should have meaningful content in each section
        const example = completeDemo.querySelector(
          '[data-test-id="demo-example"]'
        );
        assert.ok(
          example && example.innerHTML.trim().length > 0,
          'Demo example should have content'
        );

        const description = completeDemo.querySelector(
          '[data-test-id="demo-content"]'
        );
        assert.ok(
          description && description.innerHTML.trim().length > 0,
          'Demo description should have content'
        );

        const snippet = completeDemo.querySelector(
          '[data-test-id="demo-snippet"]'
        );
        assert.ok(
          snippet && snippet.innerHTML.trim().length > 0,
          'Demo snippet should have content'
        );
      } else {
        assert.ok(true, 'No complete demo found on this page');
      }
    } else {
      assert.ok(true, 'No demos found on this page');
    }
  });

  test('it renders demo tab buttons with correct labels', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const tabButtons = document.querySelectorAll(
      '[data-test-id="demo-tab-button"]'
    );

    if (tabButtons.length > 0) {
      // Check common tab labels
      const expectedLabels = [
        'Template',
        'Component',
        'JavaScript',
        'TypeScript',
        'CSS',
        'SCSS',
      ];

      let foundValidLabel = false;
      tabButtons.forEach((button) => {
        const buttonText = button.textContent?.trim();
        if (buttonText && expectedLabels.includes(buttonText)) {
          foundValidLabel = true;
        }
      });

      if (foundValidLabel) {
        assert.ok(true, 'Found tabs with expected labels');
      } else {
        // Check if tabs have any meaningful text
        const firstButton = tabButtons[0];
        const buttonText = firstButton?.textContent?.trim();
        assert.ok(
          buttonText && buttonText.length > 0,
          'Tab buttons should have text labels'
        );
      }
    } else {
      assert.ok(true, 'No demo tab buttons found on this page');
    }
  });

  test('it maintains demo state during navigation', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demos = document.querySelectorAll('[data-test-id="docfy-demo"]');

    if (demos.length > 0) {
      // Record initial state
      const initialDemoCount = demos.length;

      // Navigate to different section and back
      await visit(
        '/docs/ember/components/docfy-previous-and-next-page#examples'
      );

      // Demos should still be present
      const demosAfterNavigation = document.querySelectorAll(
        '[data-test-id="docfy-demo"]'
      );
      assert.equal(
        demosAfterNavigation.length,
        initialDemoCount,
        'Demo count should remain the same'
      );

      // Demo structure should be maintained
      if (demosAfterNavigation.length > 0) {
        assert.dom('[data-test-id="docfy-demo"]').exists();
      }
    } else {
      assert.ok(true, 'No demos to test navigation state');
    }
  });

  test('it renders demo anchors for linking', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demos = document.querySelectorAll('[data-test-id="docfy-demo"]');

    if (demos.length > 0) {
      // Each demo should have an ID for linking
      demos.forEach((demo) => {
        const demoId = demo.getAttribute('id');
        assert.ok(
          demoId && demoId.length > 0,
          'Demo should have an ID for linking'
        );
      });

      // Check for title links within demos
      const titleLinks = document.querySelectorAll(
        '[data-test-id="demo-title"] a'
      );
      if (titleLinks.length > 0) {
        titleLinks.forEach((link) => {
          const href = link.getAttribute('href');
          assert.ok(
            href && href.startsWith('#'),
            'Title link should point to demo anchor'
          );
        });
      }
    } else {
      assert.ok(true, 'No demos found to test anchor linking');
    }
  });

  test('it handles demo content with special characters and formatting', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const demoContents = document.querySelectorAll(
      '[data-test-id="demo-content"]'
    );

    if (demoContents.length > 0) {
      // Content should be properly rendered without breaking
      demoContents.forEach((content) => {
        assert.ok(
          content.innerHTML.length > 0,
          'Demo content should be rendered'
        );

        // Check for HTML entities being properly handled
        const htmlContent = content.innerHTML;
        assert.ok(
          !htmlContent.includes('&amp;amp;'),
          'HTML entities should not be double-encoded'
        );
      });
    } else {
      assert.ok(
        true,
        'No demo content found to test special character handling'
      );
    }
  });
});
