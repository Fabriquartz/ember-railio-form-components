import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('auto-complete', {
  integration: true
});

test('renders the input', function(assert) {
  this.render(hbs`{{auto-complete}}`);

  const $component = this.$('.auto-complete');
  assert.equal($component.length, 1);

  const $input = $component.find('input');
  assert.equal($input.length, 1);
});

test('auto-complete its option list is hidden by default', function(assert) {
  this.render(hbs`{{auto-complete}}`);

  const $list = this.$('.auto-complete__option-list');
  assert.equal($list.css('display'), 'none');
});

test('auto-complete its option list is shown when input is focused', function(assert) {
  this.render(hbs`{{auto-complete}}`);
  const $input = this.$('input');
  const $list  = this.$('.auto-complete__option-list');

  // Disables sliding (and other jq fx), makes testing easier...
  jQuery.fx.off = true;

  $input.trigger($.Event('focusin'));

  assert.equal($list.css('display'), 'block');

  run(() => {
    $input.trigger($.Event('focusout'));
  });

  assert.equal($list.css('display'), 'none');
  jQuery.fx.off = false;
});

test('auto-complete renders content', function(assert) {
  this.set('content', [
    Ember.Object.create(),
    Ember.Object.create(),
    Ember.Object.create()
  ]);

  this.render(hbs`{{auto-complete content=content}}`);

  const $items = this.$('.auto-complete__option');

  assert.equal($items.length, 3);
});

test('auto-complete items have label set to items optionLabelPath', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content optionLabelPath="foo"}}`);

  const $items = this.$('.auto-complete__option');

  assert.equal($items[0].innerText.trim(), 'a');
  assert.equal($items[1].innerText.trim(), 'b');
  assert.equal($items[2].innerText.trim(), 'c');
});

test('auto-complete selected item', function(assert) {
  const selected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    selected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  selection=selection}}`);

  const $selected = this.$('.auto-complete__option--selected');
  assert.equal($selected.length, 1);
  assert.equal($selected[0].innerText.trim(), 'b');
});

test('default value of input is selected label', function(assert) {
  const selected = Ember.Object.create({ foo: 'x' });
  this.set('content', [selected]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  selection=selection}}`);

  const $input = this.$('input');

  assert.equal($input.val(), 'x');
});

test('selected value labels is a changes', function(assert) {
  const selected = Ember.Object.create({ foo: { bar: 'baz' } });

  this.set('content', [selected]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo.bar"
                                  selection=selection}}`);

  const $input = this.$('input');

  assert.equal($input.val(), 'baz');

  run(() => selected.set('foo.bar', 'quux'));

  assert.equal($input.val(), 'quux');
});

test('typing sends out onQueryChange event', function(assert) {
  assert.expect(1);
  this.render(hbs`{{auto-complete onQueryChange="onQueryChange"}}`);

  this.on('onQueryChange', (query) => assert.equal(query, 'foo'));

  run(() => {
    this.$('input').val('foo');
    this.$('input').trigger('input'); // syncs the value;
  });
});

test('typed in query overrides selected value', function(assert) {
  const selected = Ember.Object.create({ foo: 'x' });
  this.set('content', [selected]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  selection=selection}}`);

  const $input = this.$('input');
  run(() => {
    this.$('input').val('foo');
    this.$('input').trigger('input'); // syncs the value;
    this.set('selection', selected);
  });

  assert.equal($input.val(), 'foo');
});

test('typing resets the selection', function(assert) {
  const selected = Ember.Object.create({ foo: 'x' });
  this.set('content', [selected]);
  this.set('selection', selected);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"
                                  selection=selection}}`);

  run(() => {
    this.$('input').val('foo');
    this.$('input').trigger('input'); // syncs the value;
  });

  assert.equal(this.get('selection'), null);
});

test('enter selects the first entry and closes the list', function(assert) {
  const done = assert.async();
  const willBeSelected = Ember.Object.create({ foo: 'a' });

  this.set('content', [
    willBeSelected,
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  selection=selection
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');

  assert.equal(this.get('selection'), undefined);

  run(() => {
    jQuery.fx.off = true;
    $input.trigger('focusin');

    const event = $.Event('keyup');
    event.keyCode = event.which = 13;

    $input.trigger(event);
    jQuery.fx.off = false;
  });

  assert.equal(this.get('selection'), willBeSelected);

  run.later(() => {
    const $list = this.$('.auto-complete__option-list');
    assert.equal($list.css('display'), 'none');
    done();
  }, 500);
});

test('escape deletes the searchquery and closes the list', function(assert) {
  this.render(hbs`{{auto-complete}}`);

  const $input = this.$('input');
  run(() => {
    jQuery.fx.off = true;
    $input.trigger('focusin');
    $input.val('foo');
    $input.trigger('input');

    const event = $.Event('keyup');
    event.keyCode = event.which = 27;

    $input.trigger(event);
    jQuery.fx.off = false;
  });

  assert.equal($input.val(), '');
});

test('arrow down selects the next option', function(assert) {
  const nowSelected = Ember.Object.create({ foo: 'a' });
  const willBeSelected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    nowSelected,
    willBeSelected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', nowSelected);

  this.render(hbs`{{auto-complete content=content
                                  selection=selection
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), 'a');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 40;
    $input.trigger(event);
  });

  assert.equal($input.val(), 'b');
});

test('arrow up selects the next option', function(assert) {
  const willBeSelected = Ember.Object.create({ foo: 'a' });
  const nowSelected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    willBeSelected,
    nowSelected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', nowSelected);

  this.render(hbs`{{auto-complete content=content
                                  selection=selection
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), 'b');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 38;
    $input.trigger(event);
  });

  assert.equal($input.val(), 'a');
});

test('arrow up selects the first option when none selected', function(assert) {
  const willBeSelected = Ember.Object.create({ foo: 'a' });

  this.set('content', [
    willBeSelected,
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  selection=selection
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 38;
    $input.trigger(event);
  });

  assert.equal($input.val(), 'a');
});

test('click selects an item', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  selection=selection
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  const $firstItem = this.$('.auto-complete__option').first();
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');
    $firstItem.click();
  });

  assert.equal($input.val(), 'a');
});

test('selecting an item sends an optional action', function(assert) {
  assert.expect(1);
  const item = Ember.Object.create({ foo: 'a' });
  this.set('content', [item]);
  this.on('callback', (object) => assert.equal(object, item));

  this.render(hbs`{{auto-complete content=content
                                  onSelect="callback"
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  const $firstItem = this.$('.auto-complete__option').first();

  run(() => {
    $input.trigger('focusin');
    $firstItem.click();
  });
});
