import { run }                from '@ember/runloop';
import { render, find }       from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs                    from 'htmlbars-inline-precompile';
import { module, test }       from 'qunit';

module('Integration | Component | {{text-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send    = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('renders input with placeholder', async function(assert) {
    await render(hbs`{{text-field placeholder='Type your value here'}}`);

    assert.equal(this.$('input')[0].getAttribute('placeholder'), 'Type your value here');
  });

  test('input value is set to value', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{text-field value=value}}`);

    assert.equal(find('input').value, 'testing');
  });

  test('changing value changes input text', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{text-field value=value}}`);

    run(() => {
      this.set('value', 'gnitset');
    });

    assert.equal(find('input').value, 'gnitset');
  });

  test(`typing doesn't change value but sends updated`, async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');

    run(() => {
      $input.val('x');
      $input.trigger('input');
    });

    assert.equal(this.get('value'), '');
  });

  test('leaving the input triggers change', async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');

    run(() => {
      $input.val('x');
      $input.trigger('blur');
    });

    assert.equal(this.get('value'), '');
  });

  test('"change" changes value', async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');

    run(() => {
      $input.val('x');
      $input.trigger('change');
    });

    assert.equal(this.get('value'), '');
  });

  test('Format function only triggers when focusOut', async function(assert) {
    this.set('value', '');

    this.set('format', (value) => {
      assert.equal(value, '2', 'calls the format function with value');
      return `${value}0`;
    });

    await render(hbs`{{text-field value=value format=format}}`);

    let $input = this.$('input');

    run(() => {
      $input.val('2');
    });

    assert.equal($input.val(), '2', 'Input does not format on changing');

    run(() => {
      $input.trigger('blur');
    });
    assert.equal($input.val(), '20', 'FocusOut triggers format function');
  });
});
