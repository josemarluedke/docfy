import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import output from '@docfy/ember/output';
import flatNested from '@docfy/ember/-private/flat-nested';
import { DocfyService } from '@docfy/ember';
import sinon from 'sinon';

module('Unit | Service | docfy', function (hooks) {
  setupTest(hooks);

  test('it returns the nested output', function (assert) {
    const service = this.owner.lookup('service:docfy') as DocfyService;
    assert.deepEqual(service.nested, output.nested);
  });

  test('it returns the flat output', function (assert) {
    const service = this.owner.lookup('service:docfy') as DocfyService;
    assert.deepEqual(service.flat, flatNested(output.nested));
  });

  test('it returns the nested children by name', function (assert) {
    const service = this.owner.lookup('service:docfy') as DocfyService;
    assert.equal(service.findNestedChildrenByName('docs')?.name, 'docs');
  });

  test('it returns the nested children by name when scope has slashes', function (assert) {
    const service = this.owner.lookup('service:docfy') as DocfyService;
    assert.equal(service.findNestedChildrenByName('docs/core')?.name, 'core');
    assert.equal(
      service.findNestedChildrenByName('docs/ember/components')?.name,
      'components'
    );
  });

  test('it returns the page by current url', function (assert) {
    const service = this.owner.lookup('service:docfy') as DocfyService;
    const routerService = this.owner.lookup('service:router');
    // @ts-ignore
    sinon.stub(routerService, 'currentURL').get(() => '/docs/installation');

    assert.equal(service.currentPage?.title, 'Installation');
  });

  module('it finds a page by url', function () {
    test('url with trailing slash', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/installation/')?.title,
        'Installation'
      );
    });

    test('url without trailing slash', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/installation')?.title,
        'Installation'
      );
    });

    test('when the url is a index with trailing slash', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/ember/')?.title,
        'Working with Ember'
      );
    });

    test('when the url is a index without trailing slash', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/ember')?.title,
        'Working with Ember'
      );
    });

    test('when the url contains a anchor', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/ember#how-cool-is-ember')?.title,
        'Working with Ember'
      );
    });

    test('when page is not found', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(service.findByUrl('/bla/bla'), undefined);
    });

    test('when a scope is defined', function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      assert.equal(
        service.findByUrl('/docs/installation', 'docs')?.title,
        'Installation'
      );
      assert.equal(
        service.findByUrl('/docs/installation', 'whatever'),
        undefined
      );
    });
  });

  module('it can find previous and next pages', function () {
    test('when current url is the first item', async function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      const routerService = this.owner.lookup('service:router');
      // @ts-ignore
      sinon.stub(routerService, 'currentURL').get(() => '/docs/');

      assert.equal(service.previousPage()?.title, undefined);
      assert.equal(service.nextPage()?.title, 'Introduction');
    });

    test('when current url is the last item', async function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      const routerService = this.owner.lookup('service:router');
      sinon
        // @ts-ignore
        .stub(routerService, 'currentURL')
        .get(() => '/docs/ember/components/docfy-output');

      assert.equal(service.previousPage()?.title, 'Docfy Link Component');
      assert.equal(service.nextPage()?.title, undefined);
    });

    test('when current url is in the middle', async function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      const routerService = this.owner.lookup('service:router');
      // @ts-ignore
      sinon.stub(routerService, 'currentURL').get(() => '/docs/introduction');

      assert.equal(service.previousPage()?.title, 'Welcome to Docfy');
      assert.equal(service.nextPage()?.title, 'Installation');
    });

    test('when next page is under another scope', async function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      const routerService = this.owner.lookup('service:router');
      sinon
        // @ts-ignore
        .stub(routerService, 'currentURL')
        .get(() => '/docs/core/helpers/genereate-nested-output');

      assert.equal(service.nextPage()?.title, 'Working with Ember');
    });

    test('when previous page is under another scope', async function (assert) {
      const service = this.owner.lookup('service:docfy') as DocfyService;
      const routerService = this.owner.lookup('service:router');
      // @ts-ignore
      sinon.stub(routerService, 'currentURL').get(() => '/docs/ember/');

      assert.equal(service.previousPage()?.title, 'genereateNestedOutput');
    });
  });
});
