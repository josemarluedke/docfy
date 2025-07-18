import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import DocfyDemo from 'test-app-vite/components/docfy-demo';

module('Integration | Component | @docfy/docfy-demo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with basic structure', async function (assert) {
    await render(<template><DocfyDemo @id="test-demo" /></template>);

    assert.dom('[data-test-id="docfy-demo"]').exists();
    assert.dom('[data-test-id="docfy-demo"]').hasAttribute('id', 'test-demo');
    assert.dom('[data-test-demo-id="test-demo"]').exists();
  });

  test('it renders example content', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Example>
            <div data-test-id="example-content">This is example content</div>
          </demo.Example>
        </DocfyDemo>
      </template>
    );

    assert.dom('[data-test-id="demo-example"]').exists();
    assert
      .dom('[data-test-id="example-content"]')
      .hasText('This is example content');
  });

  test('it renders description with title', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Description @title="Test Demo Title">
            <p>This is the demo description</p>
          </demo.Description>
        </DocfyDemo>
      </template>
    );

    assert.dom('[data-test-id="demo-description"]').exists();
    assert.dom('[data-test-id="demo-header"]').exists();
    assert.dom('[data-test-id="demo-title"]').exists();
    assert.dom('[data-test-id="demo-title"]').hasText('Test Demo Title');
    assert.dom('[data-test-id="demo-content"]').exists();
    assert
      .dom('[data-test-id="demo-content"] p')
      .hasText('This is the demo description');
  });

  test('it renders description with edit URL', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Description
            @title="Test Demo"
            @editUrl="https://github.com/example/repo/edit/main/demo.md"
          >
            <p>Demo description</p>
          </demo.Description>
        </DocfyDemo>
      </template>
    );

    assert.dom('[data-test-id="demo-edit-url"]').exists();
    assert
      .dom('[data-test-id="demo-edit-url"]')
      .hasAttribute(
        'href',
        'https://github.com/example/repo/edit/main/demo.md'
      );
    assert
      .dom('[data-test-id="demo-edit-url"]')
      .hasAttribute('target', '_blank');
    assert
      .dom('[data-test-id="demo-edit-url"]')
      .hasAttribute('rel', 'noopener noreferrer');
    assert.dom('[data-test-id="demo-edit-url"]').hasText('Edit this demo');
  });

  test('it renders description without title and edit URL', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Description>
            <p>Demo description without title</p>
          </demo.Description>
        </DocfyDemo>
      </template>
    );

    assert.dom('[data-test-id="demo-description"]').exists();
    assert.dom('[data-test-id="demo-header"]').exists();
    assert.dom('[data-test-id="demo-title"]').doesNotExist();
    assert.dom('[data-test-id="demo-edit-url"]').doesNotExist();
    assert.dom('[data-test-id="demo-content"]').exists();
    assert
      .dom('[data-test-id="demo-content"] p')
      .hasText('Demo description without title');
  });

  test('it renders code snippets with tabs', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Snippets as |Snippet|>
            <Snippet @name="template">
              <pre><code>Template code here</code></pre>
            </Snippet>
            <Snippet @name="component">
              <pre><code>Component code here</code></pre>
            </Snippet>
          </demo.Snippets>
        </DocfyDemo>
      </template>
    );

    assert.dom('[data-test-id="demo-snippets"]').exists();
    assert.dom('[data-test-id="demo-tabs"]').exists();

    // Should have two tab buttons
    assert.dom('[data-test-id="demo-tab-button"]').exists({ count: 2 });

    // Check tab button names
    assert.dom('[data-test-snippet-name="Template"]').exists();
    assert.dom('[data-test-snippet-name="Component"]').exists();

    // First tab should be active by default
    assert
      .dom('[data-test-snippet-name="Template"]')
      .hasAttribute('data-test-is-active', 'true');
    assert
      .dom('[data-test-snippet-name="Component"]')
      .hasAttribute('data-test-is-active', 'false');

    // Should show the first snippet by default
    assert.dom('[data-test-id="demo-snippet"]').exists();
    assert.dom('[data-test-snippet-name="template"]').exists();
    assert
      .dom('[data-test-id="demo-snippet"] pre code')
      .hasText('Template code here');
  });

  test('it switches between code snippets when tabs are clicked', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="test-demo" as |demo|>
          <demo.Snippets as |Snippet|>
            <Snippet @name="template">
              <pre><code>Template code here</code></pre>
            </Snippet>
            <Snippet @name="component">
              <pre><code>Component code here</code></pre>
            </Snippet>
          </demo.Snippets>
        </DocfyDemo>
      </template>
    );

    // Initially, template should be shown
    assert.dom('[data-test-snippet-name="template"]').exists();
    assert
      .dom('[data-test-id="demo-snippet"] pre code')
      .hasText('Template code here');

    // Click on component tab
    await click('[data-test-snippet-name="Component"]');

    // Now component should be shown
    assert.dom('[data-test-snippet-name="component"]').exists();
    assert
      .dom('[data-test-id="demo-snippet"] pre code')
      .hasText('Component code here');

    // Check active states
    assert
      .dom('[data-test-snippet-name="Template"]')
      .hasAttribute('data-test-is-active', 'false');
    assert
      .dom('[data-test-snippet-name="Component"]')
      .hasAttribute('data-test-is-active', 'true');
  });

  test('it renders complete demo with all parts', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="complete-demo" as |demo|>
          <demo.Example>
            <div data-test-id="complete-example">Live demo example</div>
          </demo.Example>

          <demo.Description
            @title="Complete Demo"
            @editUrl="https://github.com/example/edit"
          >
            <p>This is a complete demo with all parts</p>
          </demo.Description>

          <demo.Snippets as |Snippet|>
            <Snippet @name="template">
              <pre><code>{{! Template code }}</code></pre>
            </Snippet>
            <Snippet @name="component">
              <pre><code>// Component code</code></pre>
            </Snippet>
            <Snippet @name="styles">
              <pre><code>/* CSS styles */</code></pre>
            </Snippet>
          </demo.Snippets>
        </DocfyDemo>
      </template>
    );

    // Check all parts are rendered
    assert.dom('[data-test-id="docfy-demo"]').exists();
    assert.dom('[data-test-demo-id="complete-demo"]').exists();

    // Example
    assert.dom('[data-test-id="demo-example"]').exists();
    assert
      .dom('[data-test-id="complete-example"]')
      .hasText('Live demo example');

    // Description
    assert.dom('[data-test-id="demo-description"]').exists();
    assert.dom('[data-test-id="demo-title"]').hasText('Complete Demo');
    assert.dom('[data-test-id="demo-edit-url"]').exists();
    assert
      .dom('[data-test-id="demo-content"] p')
      .hasText('This is a complete demo with all parts');

    // Snippets
    assert.dom('[data-test-id="demo-snippets"]').exists();
    assert.dom('[data-test-id="demo-tab-button"]').exists({ count: 3 });
    assert.dom('[data-test-snippet-name="Template"]').exists();
    assert.dom('[data-test-snippet-name="Component"]').exists();
    assert.dom('[data-test-snippet-name="Styles"]').exists();

    // Default active snippet
    assert.dom('[data-test-id="demo-snippet"]').exists();
    assert.dom('[data-test-snippet-name="template"]').exists();
  });

  test('it handles single snippet without tabs', async function (assert) {
    await render(
      <template>
        <DocfyDemo @id="single-snippet" as |demo|>
          <demo.Snippets as |Snippet|>
            <Snippet @name="template">
              <pre><code>Single snippet content</code></pre>
            </Snippet>
          </demo.Snippets>
        </DocfyDemo>
      </template>
    );

    // Should still render tabs even with single snippet
    assert.dom('[data-test-id="demo-snippets"]').exists();
    assert.dom('[data-test-id="demo-tabs"]').exists();
    assert.dom('[data-test-id="demo-tab-button"]').exists({ count: 1 });
    assert.dom('[data-test-snippet-name="Template"]').exists();
    assert
      .dom('[data-test-snippet-name="Template"]')
      .hasAttribute('data-test-is-active', 'true');

    // Should show the snippet content
    assert.dom('[data-test-id="demo-snippet"]').exists();
    assert
      .dom('[data-test-id="demo-snippet"] pre code')
      .hasText('Single snippet content');
  });

  test('it renders empty demo structure', async function (assert) {
    await render(<template><DocfyDemo @id="empty-demo" /></template>);

    assert.dom('[data-test-id="docfy-demo"]').exists();
    assert.dom('[data-test-demo-id="empty-demo"]').exists();

    // No subcomponents should be rendered
    assert.dom('[data-test-id="demo-example"]').doesNotExist();
    assert.dom('[data-test-id="demo-description"]').doesNotExist();
    assert.dom('[data-test-id="demo-snippets"]').doesNotExist();
  });
});
