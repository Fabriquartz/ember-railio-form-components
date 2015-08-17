import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('text-field', 'Integration | Component | {{text-field}}', {
  integration: true
});

test('input value is set to value', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-field value=value}}`);

  assert.equal(this.$('input').val(), 'testing');
});

test('changing value changes input text', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-field value=value}}`);

  run(() => {
    this.set('value', 'gnitset');
  });

  assert.equal(this.$('input').val(), 'gnitset');
});

test('typing changes value', function(assert) {
  this.set('value', '');
  this.render(hbs`{{text-field value=value}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), 'x');
});

test('leaving the input changes value', function(assert) {
  this.set('value', '');
  this.render(hbs`{{text-field value=value}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('blur');
  });

  assert.equal(this.get('value'), 'x');
});

test('"change" changes value', function(assert) {
  this.set('value', '');
  this.render(hbs`{{text-field value=value}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('change');
  });

  assert.equal(this.get('value'), 'x');
});
