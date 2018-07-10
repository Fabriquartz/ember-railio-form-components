import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render, find } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

module('Integration | Component | {{lazy-text-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('displays initial value', async function(assert) {
    this.set('value', 'puddy kat');
    await render(hbs`{{lazy-text-field value=value}}`);

    assert.equal(find('input').value, 'puddy kat');
  });

  test('focus in does not lose value', async function(assert) {
    this.set('value', 'test');
    await render(hbs`{{lazy-text-field value=value}}`);

    let $input = this.$('input');

    run(() => {
      $input.trigger('focusin');
    });

    assert.equal($input.val(), 'test');
    assert.equal(this.get('value'), 'test');
  });

  test('typing with focus does not call updated', async function(assert) {
    assert.expect(1);

    this.set('value', '');
    this.actions.update = function() {
      assert.ok(false, 'calls update');
    };

    await render(hbs`{{lazy-text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');

    run(() => {
      $input.trigger('focusin');
      $input.val('x');
      $input.trigger('input');
    });

    assert.equal(this.get('value'), '');
  });

  test('losing focus sends updated', async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update with new value');
    };

    await render(hbs`{{lazy-text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');

    run(() => {
      $input.trigger('focusin');
      $input.val('x');
      $input.trigger('input');

      $input.trigger('focusout');
    });

    assert.equal(this.get('value'), '');
  });

  test('when having focus, updates to value are ignored', async function(assert) {
    this.set('value', '');
    await render(hbs`{{lazy-text-field value=value}}`);

    let $input = this.$('input');

    run(() => {
      $input.trigger('focusin');
      this.set('value', 'x');
    });

    assert.equal($input.val(), '');
  });

  test('when not having focus update to value are propagated',
    async function(assert) {
      this.set('value', '');
      await render(hbs`{{lazy-text-field value=value}}`);

      run(() => {
        this.set('value', 'x');
      });

      assert.equal(find('input').value, 'x');
    });
});
