import { module, test } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | extracted preview templates', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders all preview-templates', async function (assert) {
    await visit('/docs/ember');
    assert.dom('.docfy-demo').exists({ count: 2 });

    assert
      .dom('[data-test-id="preview-1"]')
      .hasTextContaining(
        'I can have any hbs here and I can use any component avaliable in the host app.'
      );
    assert
      .dom('[data-test-id="preview-2"]')
      .hasTextContaining('Another preview here');

    const snippets = findAll('.docfy-demo__snippet');
    assert.dom(snippets[0]).hasTextContaining('data-test-id="preview-1"');
    assert.dom(snippets[1]).hasTextContaining(' data-test-id="preview-2"');
  });
});
