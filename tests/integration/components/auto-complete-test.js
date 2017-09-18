import { moduleForComponent, test } from 'ember-qunit';
import EmberObject from 'ember-object';

import run   from 'ember-runloop';
import hbs   from 'htmlbars-inline-precompile';
import { A } from 'ember-array/utils';
import $     from 'jquery';

import {
  getSelected,
  getMultipleTrigger,
  getClearButton,
  clickTrigger,
  currentOptions } from '../../helpers/ember-power-select';

moduleForComponent('auto-complete', 'Integration | Component | {{auto-complete}}', {
  integration: true,

  beforeEach() {
    this.on('updated', function() { });
  }
});

test('renders the content', function(assert) {
  this.set('content', [
    EmberObject.create({ foo: 'a' }),
    EmberObject.create({ foo: 'b' }),
    EmberObject.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  clickTrigger();

  let $items = $('.ember-power-select-dropdown li');

  assert.equal($items.length, 3, 'content length');

  assert.equal($items[0].innerText.trim(), 'a', 'shows first item');
  assert.equal($items[1].innerText.trim(), 'b', 'shows second item');
  assert.equal($items[2].innerText.trim(), 'c', 'shows third item');
});

test('auto-complete items have label set to items optionLabelPath',
function(assert) {
  this.set('content', [
    EmberObject.create({ foo: 'a' }),
    EmberObject.create({ foo: 'b' }),
    EmberObject.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  clickTrigger();

  let $items = $('.ember-power-select-dropdown li');

  assert.equal($items[0].innerText.trim(), 'a');
  assert.equal($items[1].innerText.trim(), 'b');
  assert.equal($items[2].innerText.trim(), 'c');
});

test('renders the search input on open', function(assert) {
  this.render(hbs`{{auto-complete updated=(action 'updated')}}`);

  clickTrigger();

  assert.equal($('.ember-power-select-dropdown input').length, 1);
});

test('search input disabled', function(assert) {
  this.render(hbs`{{auto-complete disableSearch=true
                                  updated=(action 'updated')}}`);

  clickTrigger();

  assert.equal($('.ember-power-select-dropdown input').length, 0);
});

test('content grouped by groupLabelPath', function(assert) {
  this.set('content', [
    EmberObject.create({ foo: 'a', bar: 'group 1' }),
    EmberObject.create({ foo: 'b', bar: 'group 2' }),
    EmberObject.create({ foo: 'c', bar: 'group 1' }),
    EmberObject.create({ foo: 'd' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  groupLabelPath="bar"
                                  updated=(action 'updated')}}`);

  clickTrigger();

  let $groups = $('li.ember-power-select-group');
  let $items1 = $groups.eq(0).find('li.ember-power-select-option');
  let $items2 = $groups.eq(1).find('li.ember-power-select-option');
  let $items  = $('li.ember-power-select-option');

  assert.equal($groups.length, 2, 'renders 2 groups');
  assert.equal($items1.length, 2, 'renders 2 items for group 1');
  assert.equal($items2.length, 1, 'renders 1 item for group 2');
  assert.equal($items.length,  4, 'renders 4');

  assert.notEqual($groups.eq(0).text().indexOf('group 1'), -1, 'show group 1 label');
  assert.equal($items1.eq(0).text().trim(), 'a', 'show group 1 first item');
  assert.equal($items1.eq(1).text().trim(), 'c', 'show group 1 second item');

  assert.notEqual($groups.eq(1).text().indexOf('group 2'), -1, 'show group 2 label');
  assert.equal($items2.eq(0).text().trim(), 'b', 'show group 2 item');

  assert.equal($items.eq(3).text().trim(), 'd', 'show item outside groups');
});

test('value selected', function(assert) {
  let selected = EmberObject.create({ foo: 'b' });

  this.set('content', [
    EmberObject.create({ foo: 'a' }),
    selected,
    EmberObject.create({ foo: 'c' })
  ]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  value=selection
                                  updated=(action 'updated')}}`);

  let $selection = getSelected();

  assert.equal($selection.length, 1);
  assert.equal($selection[0].innerText.trim(), 'b', 'value selected');
});

test('typing sends out onQueryChange event', function(assert) {
  assert.expect(2);

  this.on('onQueryChange', () => {
    assert.ok(true);
    return [];
  });

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  onQueryChange=(action "onQueryChange")
                                  updated=(action 'updated')}}`);

  clickTrigger();

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

test('typing filters content', function(assert) {
  this.set('content', [
    EmberObject.create({ foo: 'Chris' }),
    EmberObject.create({ foo: 'Alex' }),
    EmberObject.create({ foo: 'Bart' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  clickTrigger();

  let $input = $('.ember-power-select-dropdown input');

  run(() => {
    $input.val('a');
    $input.trigger('input');
  });

  let $items = $('.ember-power-select-dropdown li');
  let $highlighted = currentOptions();

  assert.equal($items.length, 2);
  assert.equal($highlighted.length, 1);
  assert.equal($highlighted[0].innerText.trim(), 'Alex', 'first item selected');
});

test('remove button clears the selection', function(assert) {
  let selected = EmberObject.create({ foo: 'a' });

  this.set('content', [selected]);
  this.set('selection', selected);
  this.on('updated', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  optionLabelPath="foo"}}`);

  let $clearButton = getClearButton();

  assert.equal($clearButton.length, 1, 'Show clear button when something selected');

  run(() => $clearButton.trigger('mousedown'));

  assert.equal(this.get('selection'), null);
});

test('No clear button when disableClear', function(assert) {
  let selected = EmberObject.create({ foo: 'a' });

  this.set('content', [selected]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  disableClear=disableClear
                                  updated=(action "updated")
                                  optionLabelPath="foo"}}`);

  assert.equal(getClearButton().length, 1,
               'By default show clear button when something selected');

  this.set('disableClear', true);

  assert.equal(getClearButton().length, 0,
               'No clear button when disableClear is true');
});

test('auto-complete changes content', function(assert) {
  let object1 = EmberObject.create();
  let object2 = EmberObject.create();
  let object3 = EmberObject.create();

  this.set('content', A([object1, object2, object3]));

  this.render(hbs`{{auto-complete content=content
                                  updated=(action "updated")}}`);

  clickTrigger();

  let $items = $('.ember-power-select-dropdown li');
  assert.equal($items.length, 3);

  run(() => {
    let newArray = A([object1, object3]);
    this.set('content', newArray);
  });

  $items = $('.ember-power-select-dropdown li');
  assert.equal($items.length, 2);
});

test('when selection changes from elsewhere, it changes here', function(assert) {
  let selected = EmberObject.create({ foo: 'a' });
  let option   = EmberObject.create({ foo: 'b' });

  this.set('content', [selected, option]);
  this.set('selection', selected);
  this.on('updated', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  optionLabelPath="foo"}}`);

  run(() => {
    this.set('selection', option);
  });

  assert.equal(getSelected()[0].innerText.indexOf('b'), 0, 'change selected item');

  run(() => {
    this.set('selection', null);
  });

  assert.equal(getSelected().length, 0, 'empty selected item');
});

test('pass prompt as placeholder', function(assert) {
  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  prompt="Select your item"
                                  optionLabelPath="foo"}}`);

  let autoCompleteText = $('.auto-complete')[0].innerText.trim();

  assert.equal(autoCompleteText, 'Select your item');
});

test('Renders as multi-select when multiSelect=true', function(assert) {
  this.set('selection', [
    EmberObject.create({ name: 'foo' }),
    EmberObject.create({ name: 'bar' })
  ]);
  this.render(hbs`{{auto-complete content=content
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
