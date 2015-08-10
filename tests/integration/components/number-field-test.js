import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('number-field', {
  integration: true
});

const { run } = Ember;

test('value gets formatted (default 2 decimals)', function(assert) {
  this.set('value', 42);
  this.render(hbs`{{number-field value=value}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '42,00');
});

test('empty sets value to null', function(assert) {
  this.render(hbs`{{number-field value=value}}`);
  const $input = this.$('input');

  run(() => {
    $input.val('');
    $input.trigger('input');
  });

  assert.equal($input.val(), '');
  assert.equal(this.get('value'), null);
});

test('typing in value gets formatted', function(assert) {
  this.render(hbs`{{number-field value=value}}`);
  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('42');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '42,00');
  assert.inDelta(this.get('value'), 42, 0.1);

  run(() => {
    $input.trigger('focusin');
    $input.val('123.567');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '123,57');
  assert.inDelta(this.get('value'), 123.57, 0.1);
});

test('arrow up increases value by one', function(assert) {
  this.set('value', 2.2);
  this.render(hbs`{{number-field value=value}}`);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal($input.val(), '3,20');
  assert.inDelta(this.get('value'), 3.2, 0.1);
});

test('arrow down decreases value by one', function(assert) {
  this.set('value', 2.2);
  this.render(hbs`{{number-field value=value}}`);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal($input.val(), '1,20');
  assert.inDelta(this.get('value'), 1.2, 0.1);
});
