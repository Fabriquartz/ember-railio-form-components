import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, blur, triggerEvent, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{paper-text-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('renders input with placeholder', async function(assert) {
    await render(hbs`{{paper-text-field placeholder='Type your value here'}}`);

    assert.equal(this.$('input')[0].getAttribute('placeholder'),
                 'Type your value here');
  });

  test('input value is set to value', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{paper-text-field value=value}}`);

    assert.equal(find('input').value, 'testing');
  });

  test('changing value changes input text', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{paper-text-field value=value}}`);

    await this.set('value', 'gnitset');

    assert.equal(find('input').value, 'gnitset');
  });

  test(`typing doesn't change value but sends updated`, async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{paper-text-field value=value updated=(action "update")}}`);

    let $input = this.$('input');
    $input.val('x');
    await $input.trigger('input');

    assert.equal(this.get('value'), '');
  });

  test('"input" changes value', async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{paper-text-field value=value updated=(action "update")}}`);

    let $input = find('input');

    $input.value = 'x';
    await triggerEvent($input, 'input');

    assert.equal(this.get('value'), '');
  });

  test('Format function only triggers when focusOut', async function(assert) {
    this.set('value', '');

    this.set('format', (value) => {
      assert.equal(value, '2', 'calls the format function with value');
      return `${value}0`;
    });

    await render(hbs`{{paper-text-field value=value format=format}}`);

    let $input = find('input');
    await focus($input);

    $input.value = '2';
    await triggerEvent($input, 'input');

    assert.equal($input.value, '2', 'Input does not format on changing');

    await blur($input);
    assert.equal($input.value, '20', 'FocusOut triggers format function');
  });
});
