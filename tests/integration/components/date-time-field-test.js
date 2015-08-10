import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('date-time-field', {
  integration: true
});

test('set to now', function(assert) {
  this.render(hbs`{{date-time-field datetime=value}}`);
  this.$('.date-time-field-clock').click();
  assert.inDelta(+this.get('value'), +(new Date()), 1000);
});

test('unset time', function(assert) {
  this.set('value', new Date());
  this.render(hbs`{{date-time-field datetime=value}}`);
  this.$('.date-time-field-reset').click();
  assert.equal(this.get('value'), null);
});
