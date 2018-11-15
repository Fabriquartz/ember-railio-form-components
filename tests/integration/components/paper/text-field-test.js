import { module, test }       from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render, find, blur,
  triggerEvent, focus, fillIn } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{paper/text-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = { _update: () => {} };
  });

  test('renders input with placeholder', async function(assert) {
    await render(hbs`{{paper/text-field placeholder='Type your value here'}}`);

    assert.equal(find('input').getAttribute('placeholder'),
                 'Type your value here');
  });

  test('input value is set to value', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{paper/text-field value=value}}`);

    assert.equal(find('input').value, 'testing');
  });

  test('changing value changes input text', async function(assert) {
    this.set('value', 'testing');
    await render(hbs`{{paper/text-field value=value}}`);

    await this.set('value', 'gnitset');

    assert.equal(find('input').value, 'gnitset');
  });

  test(`typing doesn't change value but sends _update`, async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{paper/text-field value=value _update=(action "update")}}`);

    let $input = find('input');
    await fillIn($input, 'x');

    assert.equal(this.get('value'), '');
  });

  test('"input" changes value', async function(assert) {
    assert.expect(2);

    this.set('value', '');
    this.actions.update = function(value) {
      assert.equal(value, 'x', 'calls update function with new value');
    };

    await render(hbs`{{paper/text-field value=value _update=(action "update")}}`);

    let $input = find('input');

    $input.value = 'x';
    await triggerEvent($input, 'input');

    assert.equal(this.get('value'), '');
  });

  test('Format function only triggers on init and on focusOut',
  async function(assert) {
    assert.expect(6);

    this.set('value', 'Foo');
    this.set('_update', () => {});

    this.set('format', (value) => {
      assert.equal(value, expectedValue, 'calls the format function with value');
      return `${value}z`;
    });

    let expectedValue = 'Foo';

    await render(hbs`{{paper/text-field value=value
                                        format=format
                                        _update=_update}}`);

    expectedValue = 'Fooz';

    let $input = find('input');
    assert.equal($input.value, 'Fooz', 'Init triggers format function');

    await focus($input);
    assert.equal($input.value, 'Fooz', 'Focus does not format on changing');

    await triggerEvent($input, 'input');
    assert.equal($input.value, 'Fooz', 'Input does not format on changing');

    await blur($input);
    assert.equal($input.value, 'Foozz', 'FocusOut triggers format function');
  });
});
