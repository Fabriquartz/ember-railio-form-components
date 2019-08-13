import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

module('Integration | Component | {{search-input}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('typing sends out onQueryChange event', async function(assert) {
    assert.expect(1);

    this.actions.onQueryChange = (query) => assert.equal(query, 'foo');
    await render(hbs`{{search-input onQueryChange=(action "onQueryChange")}}`);

    run(() => {
      this.$('input').val('foo');
      this.$('input').trigger('input'); // syncs the value;
    });
  });
});
