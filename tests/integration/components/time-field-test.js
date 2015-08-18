import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('time-field', 'Integration | Component | {{time-field}}', {
  integration: true
});

function fillIn(input, value) {
  run(() => {
    input.trigger('focusin');
    input.val(value);
    input.trigger('input');
    input.trigger('focusout');
  });
}

function arrowKey(input, upOrDown, shift = false) {
  const keyCode = upOrDown === 'up' ? 38 : 40;

  run(() => {
    input.trigger('focusin');
    input.trigger($.Event('keydown', { keyCode, shiftKey: shift }));
  });
}
function arrowUp(input, shift)   { arrowKey(input, 'up', shift);   }
function arrowDown(input, shift) { arrowKey(input, 'down', shift); }

test('date gets formatted to a time string', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '12:15');
});

test('null is a possibility', function(assert) {
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '');
});

test('typing in a time updates the time part of a date', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  fillIn($input, '12:30');

  assert.equal($input.val(), '12:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 30)));
});

test('typing in an empty value', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  fillIn($input, '');

  assert.equal($input.val(), '0:00');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 0, 0)));
});

test('typing in time shorthands', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  fillIn($input, '1230');

  assert.equal($input.val(), '12:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 30)));

  fillIn($input, '930');

  assert.equal($input.val(), '9:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 9, 30)));

  fillIn($input, '12');

  assert.equal($input.val(), '12:00');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 0)));

  fillIn($input, '1');

  assert.equal($input.val(), '1:00');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 1, 0)));
});

test('typing in with different seperators', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  fillIn($input, '12;30');

  assert.equal($input.val(), '12:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 30)));

  fillIn($input, '12,30');

  assert.equal($input.val(), '12:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 30)));

  fillIn($input, '12.30');

  assert.equal($input.val(), '12:30');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 30)));
});

test('arrow up increases time by one hour', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  arrowUp($input);

  assert.equal($input.val(), '13:15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 13, 15)));

  this.set('value', new Date(2015, 0, 1, 23, 15));

  arrowUp($input);

  assert.equal($input.val(), '0:15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 2, 0, 15)));
});

test('arrow down decreases time by one hour', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  arrowDown($input);

  assert.equal($input.val(), '11:15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 11, 15)));

  this.set('value', new Date(2015, 0, 2, 0, 15));

  arrowDown($input);

  assert.equal($input.val(), '23:15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 23, 15)));
});

test('shift + arrow up increases time by one minute', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  arrowUp($input, true);

  assert.equal($input.val(), '12:16');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 16)));

  this.set('value', new Date(2015, 0, 1, 23, 59));

  arrowUp($input, true);

  assert.equal($input.val(), '0:00');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 2, 0, 0)));
});

test('shift + arrow down decreases time by one minute', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 15));
  this.render(hbs`{{time-field datetime=value}}`);

  const $input = this.$('input');

  arrowDown($input, true);

  assert.equal($input.val(), '12:14');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 12, 14)));

  this.set('value', new Date(2015, 0, 2, 0, 0));

  arrowDown($input, true);

  assert.equal($input.val(), '23:59');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1, 23, 59)));
});
