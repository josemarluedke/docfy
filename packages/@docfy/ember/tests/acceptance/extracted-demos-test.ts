import { module, test } from 'qunit';
import { visit, click, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | extracted demos', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders all extracted demos contents', async function (assert) {
    await visit('/docs/ember/components/docfy-link');

    assert.dom('.docfy-demo').exists({ count: 2 });

    assert
      .dom('[data-test-id="demo-1"]')
      .hasTextContaining('This is my Demo: My Link');
    assert
      .dom('[data-test-id="demo-1-js-data"]')
      .hasTextContaining('/docs/ember/');

    assert.dom('[data-test-id="demo-2"]').exists();
  });

  test('it renders demo title, markdown content, edit url', async function (assert) {
    await visit('/docs/ember/components/docfy-link');

    assert.dom('.docfy-demo').exists({ count: 2 });

    const titles = findAll('.docfy-demo__description__header__title');
    const editUrls = findAll('.docfy-demo__description__header__edit-url');
    const contents = findAll('.docfy-demo__description__content');

    assert.dom(titles[0]).hasTextContaining('Demo of DocfyLink component');
    assert.dom(titles[1]).hasTextContaining('This demo only has a template');

    assert
      .dom(editUrls[0])
      .hasAttribute(
        'href',
        'https://github.com/josemarluedke/docfy/edit/master/packages/@docfy/ember/dummy-docs/packages/ember/components/docfy-link-demo/demo1.md'
      );
    assert
      .dom(editUrls[1])
      .hasAttribute(
        'href',
        'https://github.com/josemarluedke/docfy/edit/master/packages/@docfy/ember/dummy-docs/packages/ember/components/docfy-link-demo/demo2.md'
      );

    assert.dom(contents[0]).hasTextContaining('This is a cool feature');
    assert
      .dom(contents[1])
      .hasTextContaining(
        'I can use markdown here. Item 1 Item 2 Super Cool This is a cool feature.'
      );
  });

  test('it renders code snippets', async function (assert) {
    await visit('/docs/ember/components/docfy-link');

    assert.dom('.docfy-demo').exists({ count: 2 });

    const tabs = findAll('.docfy-demo__snippets__tabs');
    const snippets = findAll('.docfy-demo__snippet');

    assert.dom(tabs[0]).hasTextContaining('Template Component');
    assert.equal(tabs[1], undefined);

    assert.dom(snippets[0]).hasTextContaining('<div data-test-id="demo-1">');
    assert
      .dom(snippets[1])
      .hasTextContaining(
        '<DocfyLink @to="/" class="font-bold" data-test-id="demo-2">'
      );

    await click(findAll('.docfy-demo__snippets__tabs__button')[1]);
    const snippet0 = findAll('.docfy-demo__snippet')[0];
    assert
      .dom(snippet0)
      .hasTextContaining('export default class MyDemo extends Component');
  });
});
