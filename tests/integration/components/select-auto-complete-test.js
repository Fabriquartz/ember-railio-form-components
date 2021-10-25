import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import { clickTrigger, typeInSearch } from '../../helpers/ember-power-select';

import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Component | {{select-auto-complete}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = { updated: () => {} };
  });

  test('filters content depending on search query', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'dog' }),
      EmberObject.create({ foo: 'cat' }),
      EmberObject.create({ foo: 'lion' }),
    ]);

    await render(hbs`{{select-auto-complete content=content
                                           optionLabelPath="foo"
                                           updated=(action 'updated')}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-options li');

    assert.equal($items.length, 3);

    await typeInSearch('o');

    $items = $('.ember-power-select-options li');
    assert.equal($items.length, 2);

    assert.equal($items[0].textContent.trim(), 'dog');
    assert.equal($items[1].textContent.trim(), 'lion');
  });

  test('calls onQueryChange', async function (assert) {
    assert.expect(1);

    this.actions.queryChanged = function (query) {
      assert.equal(query, 'o', 'calls onQueryChange with new query');
    };

    await render(hbs`
      {{select-auto-complete content=content
                             optionLabelPath="foo"
                             onQueryChange=(action "queryChanged")
                             updated=(action 'updated')}}`);

    await clickTrigger();
    await typeInSearch('o');
  });
});
