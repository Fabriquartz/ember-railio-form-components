import { moduleForComponent, test } from 'ember-qunit';

import EmberObject      from 'ember-object';
import { clickTrigger } from '../../helpers/ember-power-select';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';
import $   from 'jquery';

moduleForComponent(
  'select-auto-complete', 'Integration | Component | {{select-auto-complete}}',
{
  integration: true,

  beforeEach() {
    this.on('updated', function() { });
  }
});

test('filters content depending on search query', function(assert) {
  this.set('content', [
    EmberObject.create({ foo: 'dog' }),
    EmberObject.create({ foo: 'cat' }),
    EmberObject.create({ foo: 'lion' })
  ]);

  this.render(hbs`{{select-auto-complete content=content
                                         optionLabelPath="foo"
                                         updated=(action 'updated')}}`);

  clickTrigger();

  let $items = $('.ember-power-select-dropdown li');

  assert.equal($items.length, 3);

  run(() => {
    let $input = $('.ember-power-select-dropdown input');
    $input.val('o');
    $input.trigger('input');
  });

  $items = $('.ember-power-select-dropdown li');
  assert.equal($items.length, 2);

  assert.equal($items[0].innerText.trim(), 'dog');
  assert.equal($items[1].innerText.trim(), 'lion');
});

test('calls onQueryChange', function(assert) {
  assert.expect(1);

  this.on('queryChanged', function(query) {
    assert.equal(query, 'o', 'calls onQueryChange with new query');
  });

  this.render(hbs`
    {{select-auto-complete content=content
                           optionLabelPath="foo"
                           onQueryChange=(action "queryChanged")
                           updated=(action 'updated')}}`);

  clickTrigger();

  run(() => {
    let $input = $('.ember-power-select-dropdown input');
    $input.val('o');
    $input.trigger('input');
  });
});
