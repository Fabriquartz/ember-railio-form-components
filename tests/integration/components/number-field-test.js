import hbs                          from 'htmlbars-inline-precompile';
import run                          from 'ember-runloop';
import $                            from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import wait                         from 'ember-test-helpers/wait';

moduleForComponent('number-field', 'Integration | Component | {{number-field}}', {
  integration: true,
  beforeEach() {
    this.on('update', function(value) {
      this.set('number', value);
    });
  }
});

test('empty sets value to null', function(assert) {
  this.render(hbs`{{number-field value=number}}`);

  let $input = this.$('input');

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

  let $input = this.$('input');
  assert.equal($input.val(), '42,00');
});

test('typing in value gets formatted', function(assert) {
  this.render(hbs`
    {{number-field maxDecimals="2" value=number updated=(action "update")}}
  `);

  let $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.val('42');
    $input.trigger('input');
    $input.trigger('focusout');
  });

  assert.equal($input.val(), '42,00');
});

test('arrow up increases value by one', function(assert) {
  this.set('number', 1.345);
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');
  assert.equal($input.val(), '1,345');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal($input.val(), '2,345');
  assert.inDelta(this.get('number'), 2.345, 0.01);

  return wait();
});

test('arrow up when empty sets value to 1', function(assert) {
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal($input.val(), '1');
  assert.inDelta(this.get('number'), 1, 0.01);

  return wait();
});

test('arrow down decreases value by one', function(assert) {
  this.set('number', 8.456);
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');
  assert.equal($input.val(), '8,456');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal($input.val(), '7,456');
  assert.inDelta(this.get('number'), 7.456, 0.01);

  return wait();
});

test('arrow down when empty sets value to -1', function(assert) {
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal($input.val(), '-1');
  assert.inDelta(this.get('number'), -1, 0.01);

  return wait();
});

test('arrow down to negative', function(assert) {
  this.set('number', 0.4);
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal(this.get('number'), -0.6, 'pressed arrow down once');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal(this.get('number'), -1.6, 'pressed arrow down twice');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));
  });

  assert.equal(this.get('number'), -2.6, 'pressed arrow down three times');

  return wait();
});

test('arrow up from negative to positive', function(assert) {
  this.set('number', -2.7);
  this.render(hbs`
    {{number-field value=number updated=(action "update")}}
  `);

  let $input = this.$('input');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal(this.get('number'), -1.7, 'pressed arrow up once');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal(this.get('number'), -0.7, 'pressed arrow up twice');

  run(() => {
    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));
  });

  assert.equal(this.get('number'), 0.3, 'pressed arrow up three times');

  return wait();
});
