import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

module('Integration | Component | {{check-box}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function () {
    this.actions.update = function (object, propertyPath, value) {
      object.set(propertyPath, value);
    };
  });

  test(`renders a checkbox with class check-box`, async function (assert) {
    await render(hbs`{{check-box}}`);

    let $checkbox = this.$('input.check-box[type="checkbox"]');
    assert.equal($checkbox.length, 1);
  });

  test(`has given value`, async function (assert) {
    this.set('selected', true);
    await render(hbs`{{check-box value=selected}}`);

    let [$checkbox] = this.$('.check-box');
    assert.true($checkbox.checked, 'is checked');
  });

  test(`changing changes value and calls update function`, async function (assert) {
    assert.expect(3);
    this.set('selected', true);
    this.actions.update = function (value) {
      assert.false(value, 'calls update function with new value');
      this.set('selected', value);
    };

    await render(hbs`{{check-box value=selected updated=(action "update")}}`);

    let $checkbox = this.$('.check-box');

    run(() => {
      $checkbox.trigger('click');
    });
    assert.false($checkbox[0].checked, 'got unchecked');
    assert.false(this.selected, 'value changed');
  });
});
