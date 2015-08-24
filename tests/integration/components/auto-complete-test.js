import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

moduleForComponent('auto-complete', 'Integration | Component | {{auto-complete}}', {
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

  run(() => {
    $input.trigger('focusIn');
  });

  assert.equal($list.css('display'), 'block');

  run(() => {
    $input.trigger('focusout');
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
                                  value=selection}}`);

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
                                  value=selection}}`);

  const $input = this.$('input');

  assert.equal($input.val(), 'x');
});

test('typing sends out onQueryChange event', function(assert) {
  assert.expect(1);

  this.on('onQueryChange', (query) => assert.equal(query, 'foo'));
  this.render(hbs`{{auto-complete onQueryChange=(action "onQueryChange")}}`);

  run(() => {
    this.$('input').val('foo');
    this.$('input').trigger('input'); // syncs the value;
  });
});

test('typing highlights the first entry', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'cat' }),
    Ember.Object.create({ foo: 'dog' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  run(() => {
    $input.val('a');
    $input.trigger('input');
  });

  const $highlighted = this.$('.auto-complete__option--highlighted');

  assert.equal($input.val(), 'a');
  assert.equal($highlighted.text().trim(), 'cat');
});

test('enter selects the first entry and closes the list', function(assert) {
  const done = assert.async();
  const willBeSelected = Ember.Object.create({ foo: 'a' });

  this.set('content', [
    willBeSelected,
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.on('update', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "update")
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');

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

test('remove button clears the selection and searchQuery', function(assert) {
  const selected = Ember.Object.create({ foo: 'a' });

  this.set('content', [selected]);
  this.set('selection', selected);
  this.on('update', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "update")
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  const $emptyButton = this.$('.auto-complete__empty-button');

  run(() => {
    $input.val('a');
    $input.trigger('input');
    $emptyButton.trigger('click');
  });

  run.next(() => {
    assert.equal($input.val(), '');
    assert.equal(this.get('selection'), null);
  });
});

test('arrow down highlights the next option', function(assert) {
  const nowSelected = Ember.Object.create({ foo: 'a' });
  const willBeSelected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    nowSelected,
    willBeSelected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', nowSelected);

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  highlighted=highlighted
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), 'a');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 40;
    $input.trigger(event);
  });

  assert.equal($input.val(), 'a');
  assert.equal(this.get('highlighted'), willBeSelected);
});

test('arrow up highlights the previous option', function(assert) {
  const willBeSelected = Ember.Object.create({ foo: 'a' });
  const nowSelected = Ember.Object.create({ foo: 'b' });

  this.set('content', [
    willBeSelected,
    nowSelected,
    Ember.Object.create({ foo: 'c' })
  ]);
  this.set('selection', nowSelected);

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  highlighted=highlighted
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), 'b');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 38;
    $input.trigger(event);
  });

  assert.equal(this.get('highlighted'), willBeSelected);
});

test('arrow up highlights the first option when none selected', function(assert) {
  const willBeSelected = Ember.Object.create({ foo: 'a' });

  this.set('content', [
    willBeSelected,
    Ember.Object.create({ foo: 'b' }),
    Ember.Object.create({ foo: 'c' })
  ]);

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  highlighted=highlighted
                                  optionLabelPath="foo"}}`);

  const $input = this.$('input');
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');

    const event = $.Event('keydown');
    event.keyCode = event.which = 38;
    $input.trigger(event);
  });

  assert.equal(this.get('highlighted'), willBeSelected);
});

test('click selects an item', function(assert) {
  const expectedSelected = Ember.Object.create({ foo: 'b' });
  this.set('content', [
    Ember.Object.create({ foo: 'a' }),
    expectedSelected,
    Ember.Object.create({ foo: 'c' })
  ]);

  this.on('update', function(value) {
    this.set('selection', value);
  });

  this.render(hbs`{{auto-complete content=content
                                  value=selection
                                  updated=(action "update")
                                  optionLabelPath="foo"}}`);

  const $input     = this.$('input');
  const $firstItem = this.$('.auto-complete__option:eq(1)');
  assert.equal($input.val(), '');

  run(() => {
    $input.trigger('focusin');
    $firstItem.click();
  });

  assert.equal($input.val(), 'b');
  assert.equal(this.get('selection'), expectedSelected);
});

test('auto-complete changes content', function(assert) {
  const object1 = Ember.Object.create();
  const object2 = Ember.Object.create();
  const object3 = Ember.Object.create();

  this.set('content', Ember.A([object1, object2, object3]));

  this.render(hbs`{{auto-complete content=content}}`);

  let $items = this.$('.auto-complete__option');
  assert.equal($items.length, 3);

  run(() => {
    const newArray = Ember.A([object1, object3]);
    this.set('content', newArray);
  });

  $items = this.$('.auto-complete__option');
  assert.equal($items.length, 2);
});
