import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('search-input', 'Integration | Component | {{search-input}}', {
  integration: true
});

test('typing sends out onQueryChange event', function(assert) {
  assert.expect(1);

  this.on('onQueryChange', (query) => assert.equal(query, 'foo'));
  this.render(hbs`{{search-input onQueryChange=(action "onQueryChange")}}`);

  run(() => {
    this.$('input').val('foo');
    this.$('input').trigger('input'); // syncs the value;
  });
});
