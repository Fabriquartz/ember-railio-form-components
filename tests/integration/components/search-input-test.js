import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import $ from 'jquery';

moduleForComponent('search-input', 'Integration | Component | {{search-input}}', {
  integration: true
});

test('typing sends out onQueryChange event', function(assert) {
  assert.expect(1);

  this.on('onQueryChange', (query) => assert.equal(query, 'foo'));
  this.render(hbs`{{search-input onQueryChange=(action "onQueryChange")}}`);

  run(() => {
    $('input').val('foo');
    $('input').trigger('input'); // syncs the value;
  });
});
