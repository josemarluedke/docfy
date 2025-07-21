import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

/**
 * this addon doesn't use the docs/ folder.
 * it uses dummy-docs/
 */
module('Unit | Demo component generation', function (hooks) {
  setupTest(hooks);

  test('demo components are generated with the correct name', function (assert) {
    const prefix = 'docfy-demo-';
    const has = (name: string) => {
      const registration = `component:${prefix}${name}`;
      const result = this.owner.hasRegistration(registration);

      assert.ok(result, `Expect to find registration: '${registration}'`);
    };

    // dummy/docs/packages/ember-cli/components/docfy-link-demo/{demo-file}.md
    has('packages-ember-cli-components-docfy-link-demo1');
    has('packages-ember-cli-components-docfy-link-demo2');
    // dummy/docs/packages/ember-cli/components/docfy-with-hyphenated-number-2/{demo-file}.md
    has('packages-ember-cli-components-docfy-with-hyphenated-number-2-demo1');
    // where do these come from?
    has('preview-ember');
    has('preview-ember1');
    // dummy/docs/packages/ember-cli/demo/{demo-file}.md
    has('packages-ember-cli-my-ember-demo');
  });
});
