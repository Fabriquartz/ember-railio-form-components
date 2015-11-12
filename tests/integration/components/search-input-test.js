import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

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

test('assigns `results` attribute', function(assert) {
  assert.expect(1);

  this.render(hbs`{{search-input results=10}}`);
  assert.equal(this.$('input').attr('results'), 10);
});

test('has correct input[type="search"] type', function(assert) {
  assert.expect(1);

  this.render(hbs`{{search-input}}`);
  assert.equal(this.$('input').prop('type'), 'search');
});
