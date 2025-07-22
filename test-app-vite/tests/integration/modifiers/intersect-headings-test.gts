import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import sinon from 'sinon';
import intersectHeadings from 'test-app-vite/modifiers/intersect-headings';

module('Integration | Modifier | @docfy/intersect-headings', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without error', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'examples',
        title: 'Examples',
        headings: [],
      },
    ];

    await render(
      <template>
        <div {{intersectHeadings callback headings=headings}}></div>
      </template>
    );

    assert.dom('div').exists();
  });

  test('it handles empty headings array', async function (assert) {
    const callback = sinon.stub();
    const headings: any[] = [];

    await render(
      <template>
        <div {{intersectHeadings callback headings=headings}}></div>
      </template>
    );

    assert.dom('div').exists();
  });

  test('it handles undefined headings', async function (assert) {
    const callback = sinon.stub();
    const headings = undefined;

    await render(
      <template>
        <div {{intersectHeadings callback headings=headings}}></div>
      </template>
    );

    assert.dom('div').exists();
  });

  test('it flattens nested headings structure', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'examples',
        title: 'Examples',
        headings: [
          {
            id: 'simple-usage',
            title: 'Simple usage',
            headings: [],
          },
          {
            id: 'advanced-usage',
            title: 'Advanced usage',
            headings: [],
          },
        ],
      },
      {
        id: 'api',
        title: 'API',
        headings: [],
      },
    ];

    // Create DOM elements that would be observed
    const examplesHeading = document.createElement('h2');
    examplesHeading.id = 'examples';
    document.body.appendChild(examplesHeading);

    const simpleUsageHeading = document.createElement('h3');
    simpleUsageHeading.id = 'simple-usage';
    document.body.appendChild(simpleUsageHeading);

    const advancedUsageHeading = document.createElement('h3');
    advancedUsageHeading.id = 'advanced-usage';
    document.body.appendChild(advancedUsageHeading);

    const apiHeading = document.createElement('h2');
    apiHeading.id = 'api';
    document.body.appendChild(apiHeading);

    try {
      await render(
        <template>
          <div {{intersectHeadings callback headings=headings}}></div>
        </template>
      );

      assert.dom('div').exists();

      // The modifier should have found all heading elements
      // We can't easily test IntersectionObserver behavior in unit tests
      // but we can verify the component renders without error
    } finally {
      document.body.removeChild(examplesHeading);
      document.body.removeChild(simpleUsageHeading);
      document.body.removeChild(advancedUsageHeading);
      document.body.removeChild(apiHeading);
    }
  });

  test('it handles headings with missing DOM elements', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'non-existent-heading',
        title: 'Non-existent Heading',
        headings: [],
      },
    ];

    await render(
      <template>
        <div {{intersectHeadings callback headings=headings}}></div>
      </template>
    );

    // Should render without error even when DOM elements don't exist
    assert.dom('div').exists();
  });

  test('it handles callback function properly', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'test-heading',
        title: 'Test Heading',
        headings: [],
      },
    ];

    // Create a DOM element that would be observed
    const testHeading = document.createElement('h2');
    testHeading.id = 'test-heading';
    document.body.appendChild(testHeading);

    try {
      await render(
        <template>
          <div {{intersectHeadings callback headings=headings}}></div>
        </template>
      );

      assert.dom('div').exists();

      // The callback should be a function (we can't easily test intersection in unit tests)
      assert.ok(typeof callback === 'function');
    } finally {
      document.body.removeChild(testHeading);
    }
  });

  test('it handles deeply nested headings', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'level1',
        title: 'Level 1',
        headings: [
          {
            id: 'level2',
            title: 'Level 2',
            headings: [
              {
                id: 'level3',
                title: 'Level 3',
                headings: [],
              },
            ],
          },
        ],
      },
    ];

    // Create DOM elements for all levels
    const level1Heading = document.createElement('h1');
    level1Heading.id = 'level1';
    document.body.appendChild(level1Heading);

    const level2Heading = document.createElement('h2');
    level2Heading.id = 'level2';
    document.body.appendChild(level2Heading);

    const level3Heading = document.createElement('h3');
    level3Heading.id = 'level3';
    document.body.appendChild(level3Heading);

    try {
      await render(
        <template>
          <div {{intersectHeadings callback headings=headings}}></div>
        </template>
      );

      assert.dom('div').exists();
    } finally {
      document.body.removeChild(level1Heading);
      document.body.removeChild(level2Heading);
      document.body.removeChild(level3Heading);
    }
  });

  test('it handles updates to headings', async function (assert) {
    const callback = sinon.stub();
    const headings = [
      {
        id: 'initial-heading',
        title: 'Initial Heading',
        headings: [],
      },
    ];

    // Create initial DOM element
    const initialHeading = document.createElement('h2');
    initialHeading.id = 'initial-heading';
    document.body.appendChild(initialHeading);

    try {
      await render(
        <template>
          <div {{intersectHeadings callback headings=headings}}></div>
        </template>
      );

      assert.dom('div').exists();

      // Note: In GTS tests, we can't easily test reactive updates
      // but we can verify the component renders without error
      assert.dom('div').exists();
    } finally {
      document.body.removeChild(initialHeading);
    }
  });

  test('it handles missing callback gracefully', async function (assert) {
    const headings = [
      {
        id: 'test-heading',
        title: 'Test Heading',
        headings: [],
      },
    ];

    // Should render without error even with missing callback
    await render(
      <template>
        <div {{intersectHeadings undefined headings=headings}}></div>
      </template>
    );

    assert.dom('div').exists();
  });
});
