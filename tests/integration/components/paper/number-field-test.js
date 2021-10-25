import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import {
  render,
  find,
  focus,
  fillIn,
  blur,
  triggerKeyEvent,
} from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | {{paper/number-field}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {
      update: (value) => {
        this.set('number', value);
      },
    };
  });

  test('empty sets value to null', async function (assert) {
    await render(hbs`{{paper/number-field value=number}}`);

    let $input = find('input');

    await fillIn($input, '');
    assert.equal($input.value, '');
    assert.equal(this.number, null);
  });

  test('value gets formatted with two decimals by default', async function (assert) {
    this.set('number', 42);
    this.set('options', { decimals: 4 });
    await render(hbs`
      {{paper/number-field value=number
                           componentProperties=options}}`);
    let $input = find('input');
    assert.equal($input.value, '42,0000');
  });

  test('typing in value gets formatted', async function (assert) {
    await render(hbs`
      {{paper/number-field value=number updated=(action "update")}}
    `);

    let $input = find('input');

    await focus($input);
    await fillIn($input, '42');
    await blur($input);
    assert.equal($input.value, '42');
  });

  test('arrow up increases value by one', async function (assert) {
    this.set('number', 1.345);
    await render(hbs`
      {{paper/number-field decimals=3
                           value=number
                           updated=(action "update")}}
    `);

    let $input = find('input');
    assert.equal($input.value, '1,345');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 38);
    await blur($input);

    assert.equal($input.value, '2,345');
    assert.equal(this.number, 2.345);
  });

  test('arrow up when empty sets value to 1', async function (assert) {
    await render(hbs`
      {{paper/number-field value=number updated=(action "update")}}
    `);

    let $input = find('input');
    assert.equal($input.value, '');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 38);
    await blur($input);

    assert.equal($input.value, '1');
  });

  test('arrow down decreases value by one', async function (assert) {
    this.set('number', 8.456);
    await render(hbs`
      {{paper/number-field value=number
                           decimals=3
                           updated=(action "update")}}
    `);

    let $input = find('input');
    assert.equal($input.value, '8,456');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 40);
    await blur($input);

    assert.equal($input.value, '7,456');
  });

  test('arrow down when empty sets value to -1', async function (assert) {
    await render(hbs`
      {{paper/number-field value=number updated=(action "update")}}
    `);

    let $input = find('input');
    assert.equal($input.value, '');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 40);
    await blur($input);

    assert.equal($input.value, '-1');
  });

  test('arrow down to negative', async function (assert) {
    this.set('number', 0.46);
    await render(hbs`
      {{paper/number-field value=number updated=(action "update")}}
    `);

    let $input = find('input');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 40);
    await blur($input);

    assert.equal(this.number, -0.54, 'pressed arrow down once');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 40);
    await blur($input);

    assert.equal(this.number, -1.54, 'pressed arrow down twice');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 40);
    await blur($input);

    assert.equal(this.number, -2.54, 'pressed arrow down three times');
  });

  test('arrow up from negative to positive', async function (assert) {
    this.set('number', -2.73);
    await render(hbs`
      {{paper/number-field value=number updated=(action "update")}}
    `);

    let $input = find('input');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 38);
    await blur($input);

    assert.equal(this.number, -1.73, 'pressed arrow up once');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 38);
    await blur($input);

    assert.equal(this.number, -0.73, 'pressed arrow up twice');

    await focus($input);
    triggerKeyEvent($input, 'keydown', 38);
    await blur($input);

    assert.equal(this.number, 0.27, 'pressed arrow up three times');
  });
});
