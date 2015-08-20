import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('number-field', 'Integration | Component | {{number-field}}', {
  integration: true,
  beforeEach: function() {
    this.on('update', function(value) {
      this.set('number', value);
    });
  }
});

const { run } = Ember;

test('empty sets value to null', function(assert) {
  this.render(hbs`{{number-field value=number}}`);

  const $input = this.$('input');

  run(() => {
    $input.val('');
    $input.trigger('input');
  });

  assert.equal($input.val(), '');
  assert.equal(this.get('number'), null);
});

test('value gets formatted with two decimals', function(assert) {
  this.set('number', 42);
  this.render(hbs`{{number-field value=number maxDecimals=2}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '42,00');
});

test('typing in value gets formatted', function(assert) {
  this.render(hbs`
    {{number-field maxDecimals="2" value=number updated=(action "update")}}
  `);

  const $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('42');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '42,00');
});

test('arrow up increases value by one', function(assert) {
  this.set('number', 2.2);
  this.render(hbs`
    {{number-field maxDecimals="2" value=number updated=(action "update")}}
  `);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal($input.val(), '3,20');
  assert.inDelta(this.get('number'), 3.2, 0.01);
});

test('arrow down decreases value by one', function(assert) {
  this.set('number', 2.2);
  this.render(hbs`
    {{number-field maxDecimals="2" value=number updated=(action "update")}}
  `);

  const $input = this.$('input');

  assert.equal($input.val(), '2,20');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal($input.val(), '1,20');
  assert.inDelta(this.get('number'), 1.2, 0.01);
});
