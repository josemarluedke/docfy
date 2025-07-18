import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import CurrentHeadingService from 'test-app-vite/services/current-heading';

module('Unit | Service | @docfy/current-heading', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:current-heading') as CurrentHeadingService;
    assert.ok(service);
  });

  test('it initializes with no current heading', function (assert) {
    const service = this.owner.lookup('service:current-heading') as CurrentHeadingService;
    assert.strictEqual(service.currentHeadingId, undefined);
  });

  test('it can set and get current heading ID', function (assert) {
    const service = this.owner.lookup('service:current-heading') as CurrentHeadingService;
    
    service.setCurrentHeadingId('examples');
    assert.strictEqual(service.currentHeadingId, 'examples');
    
    service.setCurrentHeadingId('api');
    assert.strictEqual(service.currentHeadingId, 'api');
  });

  test('it handles empty string heading ID', function (assert) {
    const service = this.owner.lookup('service:current-heading') as CurrentHeadingService;
    
    service.setCurrentHeadingId('');
    assert.strictEqual(service.currentHeadingId, '');
  });

  test('it updates tracked property reactively', function (assert) {
    const service = this.owner.lookup('service:current-heading') as CurrentHeadingService;
    
    // Initial state
    assert.strictEqual(service.currentHeadingId, undefined);
    
    // Set first heading
    service.setCurrentHeadingId('introduction');
    assert.strictEqual(service.currentHeadingId, 'introduction');
    
    // Update to different heading
    service.setCurrentHeadingId('getting-started');
    assert.strictEqual(service.currentHeadingId, 'getting-started');
    
    // Update to another heading
    service.setCurrentHeadingId('configuration');
    assert.strictEqual(service.currentHeadingId, 'configuration');
  });
});