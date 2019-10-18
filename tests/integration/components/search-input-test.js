import { render, fillIn }     from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs                    from 'htmlbars-inline-precompile';
import { module, test }       from 'qunit';

module('Integration | Component | {{search-input}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send    = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('typing sends out onQueryChange event', async function(assert) {
    assert.expect(2);

    this.actions.onQueryChange = (query) => assert.equal(query, 'foo');
    await render(hbs`{{search-input onQueryChange=(action "onQueryChange")}}`);

    await fillIn('input', 'foo');
  });
});
