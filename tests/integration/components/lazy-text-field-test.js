import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('lazy-text-field', 'Integration | Component | {{lazy-text-field}}', {
  integration: true
});

test('displays initial value', function(assert) {
  this.set('value', 'puddy kat');
  this.render(hbs`{{lazy-text-field value=value}}`);

  assert.equal(this.$('input').val(), 'puddy kat');
});

test('focus in does not lose value', function(assert) {
  this.set('value', 'test');
  this.render(hbs`{{lazy-text-field value=value}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
  });

  assert.equal($input.val(), 'test');
  assert.equal(this.get('value'), 'test');
});

test('typing with focus does not call updated', function(assert) {
  assert.expect(1);

  this.set('value', '');
  this.on('update', function() {
    assert.ok(false, 'calls update');
  });

  this.render(hbs`{{lazy-text-field value=value updated=(action "update")}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), '');
});

test('losing focus sends updated', function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update with new value');
  });

  this.render(hbs`{{lazy-text-field value=value updated=(action "update")}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('x');
    $input.trigger('input');

    $input.trigger('focusout');
  });

  assert.equal(this.get('value'), '');
});

test('when having focus, updates to value are ignored', function(assert) {
  this.set('value', '');
  this.render(hbs`{{lazy-text-field value=value}}`);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    this.set('value', 'x');
  });

  assert.equal($input.val(), '');
});

test('when not having focus update to value are propagated', function(assert) {
  this.set('value', '');
  this.render(hbs`{{lazy-text-field value=value}}`);

  run(() => {
    this.set('value', 'x');
  });

  assert.equal(this.$('input').val(), 'x');
});
