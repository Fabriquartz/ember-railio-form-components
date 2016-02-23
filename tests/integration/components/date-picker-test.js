import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('date-picker', 'Integration | Component | {{date-picker}}', {
  integration: true,
  beforeEach: function() {
    this.on('update', function(value) {
      this.set('value', value);
    });
  }
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

test('date gets formatted to date string', function(assert) {
  this.set('value', new Date(2015, 0, 1));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '01-01-15');
});

test('null is an option', function(assert) {
  this.render(hbs`{{date-picker value=value}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '');
});

test('filling in a date works', function(assert) {
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  fillIn($input, '05-05-15');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));
});

test('typing in an empty value', function(assert) {
  this.set('value', new Date(2015, 0, 1));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  fillIn($input, '');

  assert.equal($input.val(), '');
  assert.equal(this.get('value'), null);
});

test('typing in date shorthands', function(assert) {
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');
  const year  = (new Date()).getFullYear();
  const yearStr = year.toString().slice(-2);
  const month = `0${(new Date()).getMonth() + 1}`.substr(-2);

  fillIn($input, '050515');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));

  fillIn($input, '150515');

  assert.equal($input.val(), '15-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 15)));

  fillIn($input, '50515');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));

  fillIn($input, '1505');

  assert.equal($input.val(), `15-05-${yearStr}`);
  assert.equal(+this.get('value'), +(new Date(year, 4, 15)));

  fillIn($input, '505');

  assert.equal($input.val(), `05-05-${yearStr}`);
  assert.equal(+this.get('value'), +(new Date(year, 4, 5)));

  fillIn($input, '5');

  assert.equal($input.val(), `05-${month}-${yearStr}`);
  assert.equal(+this.get('value'), +(new Date(year, month - 1, 5)));
});

test('typing in with different separators', function(assert) {
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  fillIn($input, '05;05;15');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));

  fillIn($input, '06/05/15');

  assert.equal($input.val(), '06-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 6)));

  fillIn($input, '05\\05\\15');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));

  fillIn($input, '06,05,15');

  assert.equal($input.val(), '06-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 6)));

  fillIn($input, '05.05.15');

  assert.equal($input.val(), '05-05-15');
  assert.equal(+this.get('value'), +(new Date(2015, 4, 5)));
});

test('arrow up increases date by one day', function(assert) {
  this.set('value', new Date(2015, 0, 1));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  arrowUp($input);

  assert.equal($input.val(), '02-01-15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 2)));

  this.set('value', new Date(2015, 0, 31));

  arrowUp($input);

  assert.equal($input.val(), '01-02-15');
  assert.equal(+this.get('value'), +(new Date(2015, 1, 1)));
});

test('shift + arrow up increases date by one month', function(assert) {
  this.set('value', new Date(2015, 0));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  arrowUp($input, true);

  assert.equal($input.val(), '01-02-15');
  assert.equal(+this.get('value'), +(new Date(2015, 1, 1)));

  this.set('value', new Date(2015, 11));

  arrowUp($input, true);

  assert.equal($input.val(), '01-01-16');
  assert.equal(+this.get('value'), +(new Date(2016, 0, 1)));
});

test('arrow down decreases date by one day', function(assert) {
  this.set('value', new Date(2015, 0, 2));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  arrowDown($input);

  assert.equal($input.val(), '01-01-15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 1)));

  this.set('value', new Date(2015, 1, 1));

  arrowDown($input);

  assert.equal($input.val(), '31-01-15');
  assert.equal(+this.get('value'), +(new Date(2015, 0, 31)));
});

test('shift + arrow month decreases date by one month', function(assert) {
  this.set('value', new Date(2015, 1));
  this.render(hbs`{{date-picker value=value updated=(action "update")}}`);

  const $input = this.$('input');

  arrowDown($input, true);

  assert.equal($input.val(), '01-01-15');
  assert.equal(+this.get('value'), +(new Date(2015, 0)));

  this.set('value', new Date(2015, 0));

  arrowDown($input, true);

  assert.equal($input.val(), '01-12-14');
  assert.equal(+this.get('value'), +(new Date(2014, 11)));
});
