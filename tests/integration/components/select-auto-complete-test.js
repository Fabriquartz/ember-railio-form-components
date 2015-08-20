import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('select-auto-complete', 'Integration | Component | {{select-auto-complete}}', {
  integration: true
});

test('filters content depending on search query', function(assert) {
  this.set('content', [
    Ember.Object.create({ foo: 'dog' }),
    Ember.Object.create({ foo: 'cat' }),
    Ember.Object.create({ foo: 'lion' })
  ]);

  this.render(hbs`{{select-auto-complete content=content optionLabelPath="foo"}}`);

  let $items = this.$('.auto-complete__option');

  assert.equal($items.length, 3);

  const $input = this.$('input');

  run(() => {
    $input.val('o');
    $input.trigger('input');
  });

  $items = this.$('.auto-complete__option');
  assert.equal($items.length, 2);

  assert.equal($items[0].innerText.trim(), 'dog');
  assert.equal($items[1].innerText.trim(), 'lion');
});
