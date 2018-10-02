import hbs   from 'htmlbars-inline-precompile';
import $     from 'jquery';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render } from '@ember/test-helpers';

module('Integration | Component | {{paper-number-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.actions = { update: (value) => {
      this.set('number', value);
    } };
  });

  test('empty sets value to null', async function(assert) {
    await render(hbs`{{paper-number-field value=number}}`);

    let $input = this.$('input');

    $input.val('');
    $input.trigger('input');

    assert.equal($input.val(), '');
    assert.equal(this.get('number'), null);
  });

  test('value gets formatted with two decimals', async function(assert) {
    this.set('number', 42);
    await render(hbs`{{paper-number-field value=number maxDecimals=2}}`);

    let $input = this.$('input');
    assert.equal($input.val(), '42,00');
  });

  test('typing in value gets formatted', async function(assert) {
    await render(hbs`
      {{paper-number-field maxDecimals="2" value=number updated=(action "update")}}
    `);

    let $input = this.$('input');

    $input.trigger('focusin');
    $input.val('42');
    $input.trigger('input');
    $input.trigger('focusout');

    assert.equal($input.val(), '42,00');
  });

  test('arrow up increases value by one', async function(assert) {
    this.set('number', 1.345);
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');
    assert.equal($input.val(), '1,345');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));

    assert.equal($input.val(), '2,345');
    assert.inDelta(this.get('number'), 2.345, 0.01);
  });

  test('arrow up when empty sets value to 1', async function(assert) {
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');
    assert.equal($input.val(), '');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));

    assert.equal($input.val(), '1');
    assert.inDelta(this.get('number'), 1, 0.01);
  });

  test('arrow down decreases value by one', async function(assert) {
    this.set('number', 8.456);
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');
    assert.equal($input.val(), '8,456');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));

    assert.equal($input.val(), '7,456');
    assert.inDelta(this.get('number'), 7.456, 0.01);
  });

  test('arrow down when empty sets value to -1', async function(assert) {
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');
    assert.equal($input.val(), '');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));

    assert.equal($input.val(), '-1');
    assert.inDelta(this.get('number'), -1, 0.01);
  });

  test('arrow down to negative', async function(assert) {
    this.set('number', 0.4);
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));

    assert.equal(this.get('number'), -0.6, 'pressed arrow down once');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));

    assert.equal(this.get('number'), -1.6, 'pressed arrow down twice');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 40 }));

    assert.equal(this.get('number'), -2.6, 'pressed arrow down three times');
  });

  test('arrow up from negative to positive', async function(assert) {
    this.set('number', -2.7);
    await render(hbs`
      {{paper-number-field value=number updated=(action "update")}}
    `);

    let $input = this.$('input');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));

    assert.equal(this.get('number'), -1.7, 'pressed arrow up once');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));

    assert.equal(this.get('number'), -0.7, 'pressed arrow up twice');

    $input.trigger('focusin');
    $input.trigger($.Event('keydown', { keyCode: 38 }));

    assert.equal(this.get('number'), 0.3, 'pressed arrow up three times');
  });
});