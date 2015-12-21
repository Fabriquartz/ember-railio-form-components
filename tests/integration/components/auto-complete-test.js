import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('auto-complete', 'Integration | Component | {{auto-complete}}', {
  integration: true,

  beforeEach() {
    this.on('updated', function() { });
  }
});

test('renders the content', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  this.$('.ember-power-select-trigger').click();

  const $items = $('.ember-power-select-dropdown li');

  assert.equal($items.length, 3, 'content length');

  assert.equal($items[0].innerText.trim(), 'a', 'shows first item');
  assert.equal($items[1].innerText.trim(), 'b', 'shows second item');
  assert.equal($items[2].innerText.trim(), 'c', 'shows third item');
});

test('auto-complete items have label set to items optionLabelPath', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  this.$('.ember-power-select-trigger').click();

  const $items = $('.ember-power-select-dropdown li');

  assert.equal($items[0].innerText.trim(), 'a');
  assert.equal($items[1].innerText.trim(), 'b');
  assert.equal($items[2].innerText.trim(), 'c');
});

test('renders the search input on open', function(assert) {
  this.render(hbs`{{auto-complete updated=(action 'updated')}}`);

  this.$('.ember-power-select-trigger').click();

  assert.equal($('.ember-power-select-dropdown input').length, 1);
});

test('content grouped by groupLabelPath', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'a', bar: 'group 1' }),
    Ember.Object.create({ foo: 'b', bar: 'group 2' }),
    Ember.Object.create({ foo: 'c', bar: 'group 1' }),
    Ember.Object.create({ foo: 'd' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  groupLabelPath="bar"
                                  updated=(action 'updated')}}`);

  this.$('.ember-power-select-trigger').click();

  const $items = $('.ember-power-select-dropdown li');

  assert.notEqual($items[0].innerText.trim().indexOf('group 1'), -1);
  assert.notEqual($items[0].innerText.trim().indexOf('a'), -1);
  assert.notEqual($items[0].innerText.trim().indexOf('c'), -1);
  assert.equal($items[1].innerText.trim(), 'a');
  assert.equal($items[2].innerText.trim(), 'c');
  assert.notEqual($items[3].innerText.trim().indexOf('group 2'), -1);
  assert.notEqual($items[3].innerText.trim().indexOf('b'), -1);
  assert.equal($items[4].innerText.trim(), 'b');
  assert.equal($items[5].innerText.trim(), 'd');
});

test('value selected', function(assert) {
  const selected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    selected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  value=selection
                                  updated=(action 'updated')}}`);

  const $powerSelect = this.$('.ember-power-select');
  assert.equal($powerSelect[0].innerText.indexOf('b'), 0, 'show selected item');

  this.$('.ember-power-select-trigger').click();

  const $selection = $('.ember-power-select-option--selected');

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

  this.$('.ember-power-select-trigger').click();

  run(() => {
    const $input = $('.ember-power-select-dropdown input');
    $input.val('foo');
    $input.trigger('input');
  });

  run(() => {
    const $input = $('.ember-power-select-dropdown input');
    $input.val('bar');
    $input.trigger('input');
  });
});

test('typing filters content', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'Chris' }),
    Ember.Object.create({ foo: 'Alex' }),
    Ember.Object.create({ foo: 'Bart' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  updated=(action 'updated')}}`);

  this.$('.ember-power-select-trigger').click();

  const $input = $('.ember-power-select-dropdown input');

  run(() => {
    $input.val('a');
    $input.trigger('input');
  });

  const $items = $('.ember-power-select-dropdown li');
  const $highlighted = $('.ember-power-select-option--highlighted');

  assert.equal($items.length, 2);
  assert.equal($highlighted.length, 1);
  assert.equal($highlighted[0].innerText.trim(), 'Alex', 'first item selected');
});

test('remove button clears the selection', function(assert) {
  const selected = Ember.Object.create({ foo: 'a' });

  this.set('content', [selected]);
  this.set('selection', selected);
  this.on('updated', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  optionLabelPath="foo"}}`);

  run(() => {
    this.$('.ember-power-select-clear-btn').trigger('click');
  });

  assert.equal(this.get('selection'), null);
});

test('auto-complete changes content', function(assert) {
  const object1 = Ember.Object.create();
  const object2 = Ember.Object.create();
  const object3 = Ember.Object.create();

  this.set('content', Ember.A([object1, object2, object3]));

  this.render(hbs`{{auto-complete content=content
                                  updated=(action "updated")}}`);

  this.$('.ember-power-select-trigger').click();

  let $items = $('.ember-power-select-dropdown li');
  assert.equal($items.length, 3);

  run(() => {
    const newArray = Ember.A([object1, object3]);
    this.set('content', newArray);
  });

  $items = $('.ember-power-select-dropdown li');
  assert.equal($items.length, 2);
});

test('when selection changes from elsewhere, it changes here', function(assert) {
  const selected = Ember.Object.create({ foo: 'a' });
  const option   = Ember.Object.create({ foo: 'b' });

  this.set('content', [selected, option]);
  this.set('selection', selected);
  this.on('updated', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  optionLabelPath="foo"}}`);

  const $powerSelect = this.$('.ember-power-select');

  run(() => {
    this.set('selection', option);
  });

  assert.equal($powerSelect[0].innerText.indexOf('b'), 0, 'change selected item');

  run(() => {
    this.set('selection', null);
  });

  assert.equal($powerSelect[0].innerText.trim(), '', 'empty selected item');
});

test('pass prompt as placeholder', function(assert) {
  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "updated")
                                  prompt="Select your item"
                                  optionLabelPath="foo"}}`);

  const powerSelectText = this.$('.ember-power-select')[0].innerText.trim();

  assert.equal(powerSelectText, 'Select your item');
});
