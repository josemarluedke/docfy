import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

interface SnippetDef {
  id: string;
  name: string;
}

module('Integration | Component | DocfyDemo::Snippet', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the content', async function (assert) {
    await render(hbs`
      <DocfyDemo::Snippet data-test-id="snippet">
        template block text
      </DocfyDemo::Snippet>
    `);

    assert
      .dom('[data-test-id="snippet"]')
      .hasTextContaining('template block text');
  });

  test('it registers the snippet', async function (assert) {
    assert.expect(3);

    this.set('registerSnippet', (args: SnippetDef) => {
      assert.equal(args.name, 'My-snippet');
      assert.ok(args.id);
    });

    await render(hbs`
      <DocfyDemo::Snippet
        @name="my-snippet"
        @registerSnippet={{this.registerSnippet}}
        data-test-id="snippet"
      >
        template block text
      </DocfyDemo::Snippet>
    `);

    assert.dom('[data-test-id="snippet"]').doesNotExist();
  });

  test('it only renders the snippet if @active matches the id', async function (assert) {
    let id = '';
    this.set('registerSnippet', (args: SnippetDef) => {
      id = args.id;
    });

    await render(hbs`
      <DocfyDemo::Snippet
        @active={{this.active}}
        @name="my-snippet"
        @registerSnippet={{this.registerSnippet}}
        data-test-id="snippet"
      >
        template block text
      </DocfyDemo::Snippet>
    `);

    this.set('active', id);
    assert.dom('[data-test-id="snippet"]').exists();
  });
});
