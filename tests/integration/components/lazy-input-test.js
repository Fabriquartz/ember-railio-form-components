import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('lazy-input', {
  integration: true
});

test('displays initial value', function(assert) {
  this.set('value', 'puddy kat');
  this.render(hbs`{{lazy-input value=value}}`);

  assert.equal(this.$('input').val(), 'puddy kat');
});

test('the input value does not update the value when input is focused', function(assert) {
  this.set('value', 'foo');
  this.render(hbs`{{lazy-input value=value}}`);
  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('foooo');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), 'foo');

  run(() => $input.trigger('focusout'));

  assert.equal(this.get('value'), 'foooo');
});

test('insert newline updates the value', function(assert) {
  this.set('value', 'foo');
  this.render(hbs`{{lazy-input value=value}}`);
  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('foooo');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), 'foo');

  const event = $.Event('keyup');
  event.keyCode = event.which = 13;
  run(() => $input.trigger(event));

  assert.equal(this.get('value'), 'foooo');
});
