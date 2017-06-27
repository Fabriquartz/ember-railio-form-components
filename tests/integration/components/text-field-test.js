import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('text-field', 'Integration | Component | {{text-field}}', {
  integration: true
});

test('renders input with placeholder', function(assert) {
  this.render(hbs`{{text-field placeholder='Type your value here'}}`);

  assert.equal(this.$('input')[0].getAttribute('placeholder'), 'Type your value here');
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

test(`typing doesn't change value but sends updated`, function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-field value=value updated=(action "update")}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), '');
});

test('leaving the input triggers change', function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-field value=value updated=(action "update")}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('blur');
  });

  assert.equal(this.get('value'), '');
});

test('"change" changes value', function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-field value=value updated=(action "update")}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('x');
    $input.trigger('change');
  });

  assert.equal(this.get('value'), '');
});

test('On update calls format function', function(assert) {
  assert.expect(3);
  this.set('value', '');

  this.set('format', (value) => {
    assert.equal(value, '2', 'calls the format function with value');
    return `${value}0`;
  });

  this.render(hbs`{{text-field value=value format=format}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('2');
    $input.trigger('blur');
  });

  assert.equal(this.format($input.val()), '20');
});
