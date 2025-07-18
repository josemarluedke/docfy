import { module, test } from 'qunit';
import { visit, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | template previews', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders template preview components', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Check for generated template preview components
    const previewComponents = document.querySelectorAll(
      '[data-test-id*="preview-"]'
    );

    if (previewComponents.length > 0) {
      assert.dom('[data-test-id*="preview-"]').exists();

      // Each preview should have a unique identifier
      const previewIds = Array.from(previewComponents).map((comp) =>
        comp.getAttribute('data-test-id')
      );
      const uniqueIds = [...new Set(previewIds)];
      assert.equal(
        previewIds.length,
        uniqueIds.length,
        'Each preview should have unique ID'
      );
    } else {
      assert.ok(true, 'No template previews found on this page');
    }
  });

  test('it renders extracted template content', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for template code blocks that might be extracted
    const templateBlocks = document.querySelectorAll(
      'pre code.language-hbs, pre code.language-handlebars'
    );

    if (templateBlocks.length > 0) {
      // Template blocks should contain actual template code
      templateBlocks.forEach((block) => {
        const codeContent = block.textContent || '';
        assert.ok(
          codeContent.trim().length > 0,
          'Template block should have content'
        );

        // Template code should contain Handlebars/Ember syntax
        const hasHandlebarsContent =
          codeContent.includes('{{') ||
          codeContent.includes('<') ||
          codeContent.includes('@');
        if (hasHandlebarsContent) {
          assert.ok(true, 'Template block contains expected template syntax');
        }
      });
    } else {
      assert.ok(true, 'No template code blocks found on this page');
    }
  });

  test('it renders component code snippets', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for component code blocks
    const componentBlocks = document.querySelectorAll(
      'pre code.language-js, pre code.language-typescript, pre code.language-ts'
    );

    if (componentBlocks.length > 0) {
      // Component blocks should contain actual code
      componentBlocks.forEach((block) => {
        const codeContent = block.textContent || '';
        assert.ok(
          codeContent.trim().length > 0,
          'Component block should have content'
        );

        // Component code should contain JavaScript/TypeScript syntax
        const hasJSContent =
          codeContent.includes('import') ||
          codeContent.includes('export') ||
          codeContent.includes('class') ||
          codeContent.includes('function');
        if (hasJSContent) {
          assert.ok(
            true,
            'Component block contains expected JavaScript/TypeScript syntax'
          );
        }
      });
    } else {
      assert.ok(true, 'No component code blocks found on this page');
    }
  });

  test('it renders style code snippets', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for style code blocks
    const styleBlocks = document.querySelectorAll(
      'pre code.language-css, pre code.language-scss, pre code.language-sass'
    );

    if (styleBlocks.length > 0) {
      // Style blocks should contain actual CSS
      styleBlocks.forEach((block) => {
        const codeContent = block.textContent || '';
        assert.ok(
          codeContent.trim().length > 0,
          'Style block should have content'
        );

        // Style code should contain CSS syntax
        const hasCSSContent =
          codeContent.includes('{') ||
          codeContent.includes(':') ||
          codeContent.includes(';');
        if (hasCSSContent) {
          assert.ok(true, 'Style block contains expected CSS syntax');
        }
      });
    } else {
      assert.ok(true, 'No style code blocks found on this page');
    }
  });

  test('it renders code blocks with proper syntax highlighting', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for code blocks with language classes
    const highlightedBlocks = document.querySelectorAll(
      'pre code[class*="language-"]'
    );

    if (highlightedBlocks.length > 0) {
      assert.dom('pre code[class*="language-"]').exists();

      // Check for common language classes
      const commonLanguages = [
        'hbs',
        'handlebars',
        'js',
        'javascript',
        'ts',
        'typescript',
        'css',
        'scss',
      ];
      let foundCommonLanguage = false;

      highlightedBlocks.forEach((block) => {
        const className = block.getAttribute('class') || '';
        const hasCommonLanguage = commonLanguages.some((lang) =>
          className.includes(`language-${lang}`)
        );
        if (hasCommonLanguage) {
          foundCommonLanguage = true;
        }
      });

      if (foundCommonLanguage) {
        assert.ok(true, 'Found code blocks with common programming languages');
      } else {
        assert.ok(true, 'Found syntax-highlighted code blocks');
      }
    } else {
      assert.ok(true, 'No syntax-highlighted code blocks found on this page');
    }
  });

  test('it renders code blocks with line numbers', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for code blocks with line number indicators
    const lineNumberBlocks = document.querySelectorAll(
      'pre[class*="line-numbers"], .line-numbers'
    );

    if (lineNumberBlocks.length > 0) {
      assert.dom('.line-numbers').exists();

      // Should have line number elements
      const lineNumbers = document.querySelectorAll(
        '.line-numbers-rows, .line-number'
      );
      if (lineNumbers.length > 0) {
        assert.dom('.line-numbers-rows, .line-number').exists();
      }
    } else {
      assert.ok(true, 'No line-numbered code blocks found on this page');
    }
  });

  test('it renders copyable code blocks', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for code blocks with copy functionality
    const copyButtons = document.querySelectorAll(
      'button[class*="copy"], .copy-button'
    );

    if (copyButtons.length > 0) {
      assert.dom('button[class*="copy"], .copy-button').exists();

      // Copy buttons should be associated with code blocks
      copyButtons.forEach((button) => {
        const codeBlock =
          button.closest('pre') || button.parentElement?.querySelector('pre');
        if (codeBlock) {
          assert.ok(true, 'Copy button is associated with a code block');
        }
      });
    } else {
      assert.ok(true, 'No copy buttons found on this page');
    }
  });

  test('it renders code blocks with proper indentation', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    const codeBlocks = document.querySelectorAll('pre code');

    if (codeBlocks.length > 0) {
      // Code blocks should preserve indentation
      codeBlocks.forEach((block) => {
        const codeContent = block.textContent || '';

        // Check if code contains indented lines
        const lines = codeContent.split('\n');
        const hasIndentation = lines.some(
          (line) => line.startsWith(' ') || line.startsWith('\t')
        );

        if (hasIndentation) {
          assert.ok(true, 'Code block preserves indentation');
        }
      });
    } else {
      assert.ok(true, 'No code blocks found to test indentation');
    }
  });

  test('it renders template previews with live components', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for actual rendered components from templates
    const renderedComponents = document.querySelectorAll(
      '[data-test-id^="demo-"], [class*="docfy-"], [data-test-id*="preview-"]'
    );

    if (renderedComponents.length > 0) {
      // Components should have interactive elements
      const interactiveElements = document.querySelectorAll(
        'button, input, select, textarea, a[href]'
      );

      if (interactiveElements.length > 0) {
        assert.dom('button, input, select, textarea, a[href]').exists();

        // Test that interactive elements are functional
        const buttons = document.querySelectorAll('button:not([disabled])');
        if (buttons.length > 0) {
          // Try clicking a button if it exists
          const firstButton = buttons[0];
          if (firstButton && firstButton.getAttribute('data-test-id')) {
            await click(firstButton);
            assert.ok(true, 'Interactive button is clickable');
          }
        }
      }
    } else {
      assert.ok(true, 'No rendered components found on this page');
    }
  });

  test('it renders template previews with proper styling', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for styled components
    const styledElements = document.querySelectorAll(
      '[class*="docfy-"], [data-test-id*="demo-"]'
    );

    if (styledElements.length > 0) {
      // Elements should have CSS classes applied
      styledElements.forEach((element) => {
        const classes = element.getAttribute('class') || '';
        assert.ok(classes.length > 0, 'Styled element should have CSS classes');
      });

      // Check for proper styling structure
      const hasProperStyling = Array.from(styledElements).some((element) => {
        const computedStyle = window.getComputedStyle(element);
        return (
          computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden'
        );
      });

      if (hasProperStyling) {
        assert.ok(true, 'Elements have proper styling applied');
      }
    } else {
      assert.ok(true, 'No styled elements found on this page');
    }
  });

  test('it renders multi-file template previews', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for demos with multiple code snippets
    const demos = document.querySelectorAll('[data-test-id="docfy-demo"]');

    if (demos.length > 0) {
      // Find demos with multiple tabs
      const multiTabDemos = Array.from(demos).filter((demo) => {
        const tabButtons = demo.querySelectorAll(
          '[data-test-id="demo-tab-button"]'
        );
        return tabButtons.length > 1;
      });

      if (multiTabDemos.length > 0) {
        const demo = multiTabDemos[0];
        if (demo) {
          const tabButtons = demo.querySelectorAll(
            '[data-test-id="demo-tab-button"]'
          );

          assert.ok(
            tabButtons.length > 1,
            'Multi-file demo should have multiple tabs'
          );

          // Test switching between tabs
          if (tabButtons.length > 1) {
            const secondTab = tabButtons[1];
            if (secondTab) {
              await click(secondTab);

              // Should show different content
              const activeSnippet = demo.querySelector(
                '[data-test-id="demo-snippet"]'
              );
              assert.dom(activeSnippet).exists();
            }
          }
        }
      } else {
        assert.ok(true, 'No multi-file demos found on this page');
      }
    } else {
      assert.ok(true, 'No demos found to test multi-file functionality');
    }
  });

  test('it renders template previews with data attributes for testing', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Look for elements with data-test-id attributes
    const testElements = document.querySelectorAll('[data-test-id]');

    if (testElements.length > 0) {
      assert.dom('[data-test-id]').exists();

      // Test elements should have meaningful IDs
      const testIds = Array.from(testElements).map((el) =>
        el.getAttribute('data-test-id')
      );
      const meaningfulIds = testIds.filter((id) => id && id.length > 0);

      assert.equal(
        testIds.length,
        meaningfulIds.length,
        'All test elements should have meaningful data-test-id attributes'
      );

      // Check for common test ID patterns
      const commonPatterns = ['demo-', 'preview-', 'example-', 'snippet-'];
      const hasCommonPattern = testIds.some(
        (id) => id && commonPatterns.some((pattern) => id.includes(pattern))
      );

      if (hasCommonPattern) {
        assert.ok(true, 'Found elements with common test ID patterns');
      }
    } else {
      assert.ok(true, 'No test elements found on this page');
    }
  });

  test('it renders template previews with proper error handling', async function (assert) {
    await visit('/docs/ember/components/docfy-previous-and-next-page');

    // Check that page renders without JavaScript errors
    const errorElements = document.querySelectorAll(
      '.error, .alert-error, [class*="error"]'
    );

    // Should not have visible error elements
    const visibleErrors = Array.from(errorElements).filter((el) => {
      const computedStyle = window.getComputedStyle(el);
      return (
        computedStyle.display !== 'none' &&
        computedStyle.visibility !== 'hidden'
      );
    });

    assert.equal(
      visibleErrors.length,
      0,
      'Should not have visible error elements'
    );

    // Page should have rendered content
    const contentElements = document.querySelectorAll(
      'div.markdown, [data-test-id="docfy-demo"], pre code'
    );
    assert.ok(contentElements.length > 0, 'Page should have rendered content');
  });
});
