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

    assert.dom(titles[0]).hasTextContaining('This demo only has a template');
    assert.dom(titles[1]).hasTextContaining('Demo of DocfyLink component');

    assert
      .dom(editUrls[0])
      .hasAttribute(
        'href',
        'https://github.com/josemarluedke/docfy/edit/master/packages/ember/dummy-docs/packages/ember/components/docfy-link-demo/demo2.md'
      );

    assert
      .dom(editUrls[1])
      .hasAttribute(
        'href',
        'https://github.com/josemarluedke/docfy/edit/master/packages/ember/dummy-docs/packages/ember/components/docfy-link-demo/demo1.md'
      );

    assert
      .dom(contents[0])
      .hasTextContaining(
        'I can use markdown here. Item 1 Item 2 Super Cool This is a cool feature.'
      );
    assert.dom(contents[1]).hasTextContaining('This is a cool feature');
  });

  test('it renders code snippets', async function (assert) {
    await visit('/docs/ember/components/docfy-link');

    assert.dom('.docfy-demo').exists({ count: 2 });

    const tabs = findAll('.docfy-demo__snippets__tabs');
    const snippets = findAll('.docfy-demo__snippet');

    assert.dom(tabs[0]).hasTextContaining('Template Component');
    assert.equal(tabs[1], undefined);
    assert
      .dom(snippets[0])
      .hasTextContaining(
        '<DocfyLink @to="/" class="font-bold" data-test-id="demo-2">'
      );
    assert.dom(snippets[1]).hasTextContaining('<div data-test-id="demo-1">');

    await click(findAll('.docfy-demo__snippets__tabs__button')[1]);
    const snippet1 = findAll('.docfy-demo__snippet')[1];
    assert
      .dom(snippet1)
      .hasTextContaining('export default class MyDemo extends Component');
  });

  test('when manualDemoInsertion is true, replaces demo markers with demo components', async function (assert) {
    await visit('/docs/ember/plugins/manual-demo-insertion');

    // The element before the demo is marked for insertion
    const tomsterDemoPretext = findAll('p').find(
      (el) => el.innerText.trim() === 'Here is the tomster demo'
    );

    // An element from within the demo
    const tomsterDemoNode =
      tomsterDemoPretext?.nextElementSibling?.querySelector(
        '[data-test-id="tomster"]'
      );

    assert.dom(tomsterDemoNode).exists();

    const zoeyDemoPretext = findAll('p').find(
      (el) => el.innerText.trim() === 'And here is the zoey demo'
    );

    const zoeyDemoNode = zoeyDemoPretext?.nextElementSibling?.querySelector(
      '[data-test-id="zoey"]'
    );

    assert.dom(zoeyDemoNode).exists();
  });

  test('when manualDemoInsertion is true, replaces demos-all marker with all demo components', async function (assert) {
    await visit('/docs/ember/plugins/manual-demo-insertion');

    const demosAllHeading = findAll('h2').find(
      (el) => el.innerText.trim() === 'Or you can add all demos'
    );

    const demosAll =
      demosAllHeading?.nextElementSibling?.querySelectorAll('.docfy-demo');

    assert.strictEqual(demosAll?.length, 2);
  });
});
