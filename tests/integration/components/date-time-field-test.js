import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';

import { render, click } from '@ember/test-helpers';

module('Integration | Component | {{date-time-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.actions.update = function(value) {
      this.set('value', value);
    };
  });

  test('shows date and time', async function(assert) {
    this.set('value', new Date(2015, 0, 1, 12, 30));
    await render(hbs`{{date-time-field value=value updated=(action "update")}}`);

    let $dateInput = this.$('.date-picker');
    let $timeInput = this.$('.time-field');

    assert.equal($dateInput.val(), '01-01-15', 'shows date');
    assert.equal($timeInput.val(), '12:30', 'shows time');

    run(() => {
      $dateInput.val('02-01-15');
      $dateInput.trigger('input');
      $timeInput.val('13:30');
      $timeInput.trigger('input');
    });

    assert.equal(+this.get('value'), +(new Date(2015, 0, 2, 13, 30)),
                 'updates date and time');
  });

  test('set to now', async function(assert) {
    await render(hbs`{{date-time-field value=value updated=(action "update")}}`);
    await click('.date-time-field-clock');
    assert.inDelta(+this.get('value'), +(new Date()), 1000);
  });

  test('unset time', async function(assert) {
    this.set('value', new Date());
    await render(hbs`{{date-time-field value=value updated=(action "update")}}`);
    await click('.date-time-field-reset');
    assert.equal(this.get('value'), null);
  });
});
