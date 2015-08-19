import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('number-field', 'Integration | Component | {{number-field}}', {
  integration: true
});

const { run } = Ember;

test('empty sets value to null', function(assert) {
  this.set('object', Ember.Object.create());
  this.render(hbs`{{number-field object=object propertyPath="number"}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('');
    $input.trigger('input');
  });

  assert.equal($input.val(), '');
  assert.equal(this.get('value'), null);
});

test('value gets formatted with two decimals', function(assert) {
  this.set('object', Ember.Object.create({ number: 42 }));
  this.render(hbs`{{number-field maxDecimals="2" object=object propertyPath="number"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '42,00');
});

test('typing in value gets formatted', function(assert) {
  this.set('object', Ember.Object.create());
  this.render(hbs`{{number-field maxDecimals="2" object=object propertyPath="number"}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('42');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '42,00');
  assert.inDelta(this.get('object.number'), 42, 0.1);

  run(() => {
    $input.trigger('focusin');
    $input.val('123.567');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '123,56');
  assert.inDelta(this.get('object.number'), 123.56, 0.001);
});

test('arrow up increases value by one', function(assert) {
  this.set('object', Ember.Object.create({ number: 2.2 }));
  this.render(hbs`{{number-field maxDecimals="2" object=object propertyPath="number"}}`);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal($input.val(), '3,20');
  assert.inDelta(this.get('object.number'), 3.2, 0.01);
});

test('arrow down decreases value by one', function(assert) {
  this.set('object', Ember.Object.create({ number: 2.2 }));
  this.render(hbs`{{number-field maxDecimals="2" object=object propertyPath="number"}}`);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal($input.val(), '1,20');
  assert.inDelta(this.get('object.number'), 1.2, 0.01);
});

test('value is set to minValue when value is less than minValue', function(assert) {
  this.set('object', Ember.Object.create());
  this.render(hbs`{{number-field  minValue=0 object=object propertyPath="number"}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('-1');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '0');
  assert.equal(this.get('object.number'), 0);
});

test('value is set to maxValue when value is more than maxValue', function(assert) {
  this.set('object', Ember.Object.create());
  this.render(hbs`{{number-field  maxValue=1 object=object propertyPath="number"}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('2');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '1');
  assert.equal(this.get('object.number'), 1);
});

test('gets class \'invalid\' when value is invalid', function(assert) {
  assert.expect(2);
  this.set('object', Ember.Object.create());
  this.on('handleError', function(message) {
    assert.notEqual(message.indexOf('maximum'), -1, 'gets right error message');
    assert.ok(true, 'calls errorMessage function');
  });
  this.render(hbs`
    {{number-field object=object
                   propertyPath="number"
                   maxValue=1
                   errorMessage=(action "handleError")}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('2');
    $input.trigger('input');
    $input.trigger('focusout');
  });
});

test('call errorMessage function when over maxValue', function(assert) {
  assert.expect(2);
  this.set('object', Ember.Object.create());
  this.on('handleError', function(message) {
    assert.notEqual(message.indexOf('maximum'), -1, 'gets right error message');
    assert.ok(true, 'calls errorMessage function');
  });
  this.render(hbs`
    {{number-field object=object
                   propertyPath="number"
                   maxValue=1
                   errorMessage=(action "handleError")}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('2');
    $input.trigger('input');
    $input.trigger('focusout');
  });
});
