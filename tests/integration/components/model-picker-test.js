import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';

import wait from 'ember-test-helpers/wait';

const { run, set, get } = Ember;

const FOOS = [
  { id: 1, type: 'foos', attributes: { name: 'bar' } },
  { id: 2, type: 'foos', attributes: { name: 'chad' } },
  { id: 3, type: 'foos', attributes: { name: 'dave' } },
  { id: 4, type: 'foos', attributes: { name: 'bar second' } }
];

let server;
moduleForComponent('model-picker', 'Integration | Component | {{model-picker}}', {
  integration: true,
  setup() {
    server = new Pretender(function() {
      this.get('/foos', function(request) {
        const filter = request.queryParams.name;

        const filteredContent = FOOS.filter((foo) => {
          return foo.attributes.name.indexOf(filter) !== -1;
        });

        const content = JSON.stringify({ data: filteredContent });

        return [200, { 'Content-Type': 'application/json' }, content];
      });
    });
  }
});

test('Searches for given model by attribute', function(assert) {
  const done = assert.async();

  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  this.$('.ember-power-select-trigger').click();

  const $input = $('.ember-power-select-dropdown input');
  let $items = $('.ember-power-select-dropdown li');

  assert.equal($items.length, 1, 'by default no content');
  assert.equal($items[0].innerText, 'Type to search');

  run(() => {
    $input.val('bar');
    $input.trigger('input');
  });

  wait().then(() => {
    $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 2, 'finds searched model by label');
    assert.equal($items[0].innerText, 'bar', 'first item');
    assert.equal($items[1].innerText, 'bar second', 'second item');

    done();
  });
});

test('Sorts list using given sorting function', function(assert) {
  const done = assert.async();

  set(this, 'customSorting', function(a, b) {
    return Ember.compare(get(a, 'name'), get(b, 'name'));
  });

  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 sortFunction=customSorting
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  this.$('.ember-power-select-trigger').click();

  const $input = $('.ember-power-select-dropdown input');
  let $items = $('.ember-power-select-dropdown li');

  assert.equal($items.length, 1, 'by default no content');
  assert.equal($items[0].innerText, 'Type to search');

  run(() => {
    $input.val('a');
    $input.trigger('input');
  });

  wait().then(() => {
    $items = $('.ember-power-select-dropdown li');

    assert.equal($items[0].innerText, 'bar', 'first item');
    assert.equal($items[1].innerText, 'bar second', 'second item');
    assert.equal($items[2].innerText, 'chad', 'third item');
    assert.equal($items[3].innerText, 'dave', 'second item');

    done();
  });
});

test('Shows selected item', function(assert) {
  set(this, 'currentFoo', Ember.Object.create({ id: 6, name: 'bar test' }));
  this.on('update', () => { });
  this.render(hbs`{{model-picker value=currentFoo
                                 updated=(action 'update')
                                 model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  const $powerSelect = this.$('.ember-power-select');
  assert.equal($powerSelect[0].innerText.indexOf('bar test'), 0);
});
