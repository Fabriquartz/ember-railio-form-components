import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import EmberObject from '@ember/object';

import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import $ from 'jquery';

import {
  getSelected,
  getMultipleTrigger,
  getClearButton,
  clickTrigger,
  currentOptions,
} from '../../helpers/ember-power-select';

module('Integration | Component | {{auto-complete}}', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = { updated: () => {} };
  });

  test('renders the content', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'a' }),
      EmberObject.create({ foo: 'b' }),
      EmberObject.create({ foo: 'c' }),
    ]);

    await render(hbs`{{auto-complete content=content
                                     optionLabelPath="foo"
                                     updated=(action 'updated')}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-options li');

    assert.equal($items.length, 3, 'content length');

    assert.equal($items[0].textContent.trim(), 'a', 'shows first item');
    assert.equal($items[1].textContent.trim(), 'b', 'shows second item');
    assert.equal($items[2].textContent.trim(), 'c', 'shows third item');
  });

  test('sorts the content', async function (assert) {
    this.set('content', [{ foo: 'b' }, { foo: 'c' }, { foo: 'a' }]);

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    sortFunction=sortFunction
                                    updated=(action 'updated')}}`);

    await clickTrigger();
    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items.eq(0).text().trim(), 'b', 'shows first item unsorted');
    assert.equal($items.eq(1).text().trim(), 'c', 'shows second item unsorted');
    assert.equal($items.eq(2).text().trim(), 'a', 'shows third item unsorted');

    await clickTrigger();

    this.set('sortFunction', (a, b) =>
      a.foo > b.foo ? 1 : a.foo < b.foo ? -1 : 0
    );

    await clickTrigger();
    $items = $('.ember-power-select-dropdown li');

    assert.equal($items.eq(0).text().trim(), 'a', 'shows first item sorted');
    assert.equal($items.eq(1).text().trim(), 'b', 'shows second item sorted');
    assert.equal($items.eq(2).text().trim(), 'c', 'shows third item sorted');
  });

  test('renders with custom block content', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'a' }),
      EmberObject.create({ foo: 'b' }),
      EmberObject.create({ foo: 'c' }),
    ]);

    await render(hbs`
      {{#auto-complete content=content
                       updated=(action 'updated')
                       as |item|}}
        <div class="custom-item">
          {{item.foo}}
        </div>
      {{/auto-complete}}`);

    await clickTrigger();

    let $items = $('.custom-item');

    assert.equal($items.length, 3, 'renders all items with custom content');

    assert.equal($items.eq(0).text().trim(), 'a', 'shows first item content');
    assert.equal($items.eq(1).text().trim(), 'b', 'shows second item content');
    assert.equal($items.eq(2).text().trim(), 'c', 'shows third item content');
  });

  test('auto-complete items have label set to items optionLabelPath', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'a' }),
      EmberObject.create({ foo: 'b' }),
      EmberObject.create({ foo: 'c' }),
    ]);

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    updated=(action 'updated')}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items[0].textContent.trim(), 'a');
    assert.equal($items[1].textContent.trim(), 'b');
    assert.equal($items[2].textContent.trim(), 'c');
  });

  test('renders the search input on open', async function (assert) {
    await render(hbs`{{auto-complete updated=(action 'updated')}}`);

    await clickTrigger();

    assert.equal($('.ember-power-select-dropdown input').length, 1);
  });

  test('search input disabled', async function (assert) {
    await render(hbs`{{auto-complete disableSearch=true
                                    updated=(action 'updated')}}`);

    await clickTrigger();

    assert.equal($('.ember-power-select-dropdown input').length, 0);
  });

  test('content grouped by groupLabelPath', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'a', bar: 'group 1' }),
      EmberObject.create({ foo: 'b', bar: 'group 2' }),
      EmberObject.create({ foo: 'c', bar: 'group 1' }),
      EmberObject.create({ foo: 'd' }),
    ]);

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    groupLabelPath="bar"
                                    updated=(action 'updated')}}`);

    await clickTrigger();

    let $groups = $('li.ember-power-select-group');
    let $items1 = $groups.eq(0).find('li.ember-power-select-option');
    let $items2 = $groups.eq(1).find('li.ember-power-select-option');
    let $items = $('li.ember-power-select-option');

    assert.equal($groups.length, 2, 'renders 2 groups');
    assert.equal($items1.length, 2, 'renders 2 items for group 1');
    assert.equal($items2.length, 1, 'renders 1 item for group 2');
    assert.equal($items.length, 4, 'renders 4');

    assert.notEqual(
      $groups.eq(0).text().indexOf('group 1'),
      -1,
      'show group 1 label'
    );
    assert.equal($items1.eq(0).text().trim(), 'a', 'show group 1 first item');
    assert.equal($items1.eq(1).text().trim(), 'c', 'show group 1 second item');

    assert.notEqual(
      $groups.eq(1).text().indexOf('group 2'),
      -1,
      'show group 2 label'
    );
    assert.equal($items2.eq(0).text().trim(), 'b', 'show group 2 item');

    assert.equal($items.eq(3).text().trim(), 'd', 'show item outside groups');
  });

  test('value selected', async function (assert) {
    let selected = EmberObject.create({ foo: 'b' });

    this.set('content', [
      EmberObject.create({ foo: 'a' }),
      selected,
      EmberObject.create({ foo: 'c' }),
    ]);
    this.set('selection', selected);

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    value=selection
                                    updated=(action 'updated')}}`);

    let $selection = getSelected();

    assert.equal($selection.length, 1);
    assert.equal($selection[0].textContent.trim(), 'b', 'value selected');
  });

  test('typing sends out onQueryChange event', async function (assert) {
    assert.expect(2);

    this.actions.onQueryChange = () => {
      assert.ok(true);
      return [];
    };

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    onQueryChange=(action "onQueryChange")
                                    updated=(action 'updated')}}`);

    await clickTrigger();

    run(() => {
      let $input = $('.ember-power-select-dropdown input');
      $input.val('foo');
      $input.trigger('input');
    });

    run(() => {
      let $input = $('.ember-power-select-dropdown input');
      $input.val('bar');
      $input.trigger('input');
    });
  });

  test('typing filters content', async function (assert) {
    this.set('content', [
      EmberObject.create({ foo: 'Chris' }),
      EmberObject.create({ foo: 'Alex' }),
      EmberObject.create({ foo: 'Bart' }),
    ]);

    await render(hbs`{{auto-complete content=content
                                    optionLabelPath="foo"
                                    updated=(action 'updated')}}`);

    await clickTrigger();

    let $input = $('.ember-power-select-dropdown input');

    run(() => {
      $input.val('a');
      $input.trigger('input');
    });

    let $items = $('.ember-power-select-dropdown li');
    let $highlighted = currentOptions();

    assert.equal($items.length, 2);
    assert.equal($highlighted.length, 1);
    assert.equal(
      $highlighted[0].textContent.trim(),
      'Alex',
      'first item selected'
    );
  });

  test('remove button clears the selection', async function (assert) {
    let selected = EmberObject.create({ foo: 'a' });

    this.set('content', [selected]);
    this.set('selection', selected);
    this.actions.updated = function (value) {
      this.set('selection', value);
    };

    await render(hbs`{{auto-complete content=content
                                    value=selection
                                    updated=(action "updated")
                                    optionLabelPath="foo"}}`);

    let $clearButton = getClearButton();

    assert.equal(
      $clearButton.length,
      1,
      'Show clear button when something selected'
    );

    run(() => $clearButton.trigger('mousedown'));

    assert.equal(this.selection, null);
  });

  test('No clear button when disableClear', async function (assert) {
    let selected = EmberObject.create({ foo: 'a' });

    this.set('content', [selected]);
    this.set('selection', selected);

    await render(hbs`{{auto-complete content=content
                                    value=selection
                                    disableClear=disableClear
                                    updated=(action "updated")
                                    optionLabelPath="foo"}}`);

    assert.equal(
      getClearButton().length,
      1,
      'By default show clear button when something selected'
    );

    this.set('disableClear', true);

    assert.equal(
      getClearButton().length,
      0,
      'No clear button when disableClear is true'
    );
  });

  test('auto-complete changes content', async function (assert) {
    let object1 = EmberObject.create();
    let object2 = EmberObject.create();
    let object3 = EmberObject.create();

    this.set('content', A([object1, object2, object3]));

    await render(hbs`{{auto-complete content=content
                                    updated=(action "updated")}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');
    assert.equal($items.length, 3);

    run(() => {
      let newArray = A([object1, object3]);
      this.set('content', newArray);
    });

    $items = $('.ember-power-select-dropdown li');
    assert.equal($items.length, 2);
  });

  test('when selection changes from elsewhere, it changes here', async function (assert) {
    let selected = EmberObject.create({ foo: 'a' });
    let option = EmberObject.create({ foo: 'b' });

    this.set('content', [selected, option]);
    this.set('selection', selected);
    this.actions.updated = function (value) {
      this.set('selection', value);
    };

    await render(hbs`{{auto-complete content=content
                                      value=selection
                                      updated=(action "updated")
                                      optionLabelPath="foo"}}`);

    run(() => {
      this.set('selection', option);
    });

    assert.equal(
      getSelected()[0].textContent.trim().indexOf('b'),
      0,
      'change selected item'
    );

    run(() => {
      this.set('selection', null);
    });

    assert.equal(getSelected().length, 0, 'empty selected item');
  });

  test('pass prompt as placeholder', async function (assert) {
    await render(hbs`{{auto-complete content=content
                                    value=selection
                                    updated=(action "updated")
                                    prompt="Select your item"
                                    optionLabelPath="foo"}}`);

    let autoCompleteText = $('.auto-complete')[0].textContent.trim();

    assert.equal(autoCompleteText, 'Select your item');
  });

  test('Renders as multi-select when multiSelect=true', async function (assert) {
    this.set('selection', [
      EmberObject.create({ name: 'foo' }),
      EmberObject.create({ name: 'bar' }),
    ]);
    await render(hbs`{{auto-complete content=content
                                    multiSelect=true
                                    value=selection
                                    updated=(action "updated")
                                    optionLabelPath="name"}}`);

    let $powerSelectMultiple = getMultipleTrigger();
    let $selectedOptions = $('.ember-power-select-multiple-option');

    assert.equal($powerSelectMultiple.length, 1, 'renders multiple select');
    assert.equal($selectedOptions.length, 2, 'shows selected options');
    assert.ok($selectedOptions.eq(0).text().includes('foo'));
    assert.ok($selectedOptions.eq(1).text().includes('bar'));
  });

  test('Doubleclick action on multi-select item', async function (assert) {
    assert.expect(2);

    let selection = this.set('selection', [
      EmberObject.create({ name: 'foo' }),
      EmberObject.create({ name: 'bar' }),
    ]);

    this.actions.dblClickItem = (item) => {
      assert.equal(item, selection[0], 'triggers doubleclick action with item');
    };

    await render(hbs`{{auto-complete content=content
                                    multiSelect=true
                                    value=selection
                                    updated=(action "updated")
                                    doubleClickItem=(action 'dblClickItem')
                                    optionLabelPath="name"}}`);

    let $items = $('.auto-complete__item');

    assert.equal(
      $items.length,
      2,
      'renders items with auto-complete__item class'
    );

    $items.eq(0).dblclick();
  });

  test('enableSelectAll will show a select all button', async function (assert) {
    assert.expect(13);
    this.set('multiSelect', true);

    this.set('content', [
      EmberObject.create({ name: 'foo' }),
      EmberObject.create({ name: 'bar' }),
    ]);

    let updateAssert = (value) => {
      assert.deepEqual(
        value,
        this.content,
        'triggers update action with full content as value'
      );
    };

    this.actions.updated = (value) => {
      updateAssert(value);
      this.set('selection', value);
    };

    await render(hbs`{{auto-complete content=content
                                    multiSelect=multiSelect
                                    enableSelectAll=true
                                    value=selection
                                    updated=(action "updated")
                                    optionLabelPath="name"}}`);

    let $selectAll = $('.auto-complete__select-all');

    assert.equal($selectAll.length, 1, 'shows select all checkbox');
    assert.equal(
      $('.auto-complete__select-all-label').eq(0).text().trim(),
      'Select all (2)',
      'shows select all label with content amount'
    );
    assert.false($selectAll[0].checked, 'checkbox not checked');

    let $selectedOptions = $('.ember-power-select-multiple-option');

    assert.equal($selectedOptions.length, 0, 'by default no options selected');

    $selectAll.click();

    assert.true($selectAll[0].checked, 'checkbox checked');

    $selectedOptions = $('.ember-power-select-multiple-option');

    assert.equal(
      $selectedOptions.length,
      2,
      'all options selected on select all'
    );
    assert.ok($selectedOptions.eq(0).text().includes('foo'));
    assert.ok($selectedOptions.eq(1).text().includes('bar'));

    updateAssert = (value) => {
      assert.deepEqual(
        value,
        [],
        'triggers update action with empty array on deselect all'
      );
    };

    $selectAll.click();

    assert.false($selectAll[0].checked, 'checkbox not checked');

    $selectedOptions = $('.ember-power-select-multiple-option');

    assert.equal(
      $selectedOptions.length,
      0,
      'clicking select all again will deselect everything'
    );

    this.set('multiSelect', false);

    assert.equal(
      $('.auto-complete__select-all').length,
      0,
      'no select all button when not in multiSelect mode'
    );
  });

  test('selectAll true when already everything selected', async function (assert) {
    let foo = EmberObject.create({ name: 'foo' });
    let bar = EmberObject.create({ name: 'bar' });
    let baz = EmberObject.create({ name: 'baz' });

    this.set('content', [foo, bar]);
    this.set('selection', [foo, baz]);

    await render(hbs`{{auto-complete content=content
                                    multiSelect=true
                                    enableSelectAll=true
                                    value=selection
                                    updated=(action "updated")
                                    optionLabelPath="name"}}`);

    let $selectAll = $('.auto-complete__select-all');
    assert.false(
      $selectAll[0].checked,
      'not selected all when different value than content'
    );

    this.set('selection', [foo, bar]);

    assert.true(
      $selectAll[0].checked,
      'all selected when current value equals content'
    );
  });
});
