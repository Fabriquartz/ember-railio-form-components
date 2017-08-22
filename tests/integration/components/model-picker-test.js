import Ember       from 'ember';
import EmberObject from 'ember-object';
import Pretender   from 'pretender';

import { moduleForComponent, test }     from 'ember-qunit';
import { getSelected, clickTrigger } from '../../helpers/ember-power-select';

import wait from 'ember-test-helpers/wait';
import run  from 'ember-runloop';
import hbs  from 'htmlbars-inline-precompile';
import get  from 'ember-metal/get';
import set  from 'ember-metal/set';
import $    from 'jquery';

const { compare } = Ember;

const FOOS = [
  { id: 1, type: 'foo', attributes: { name: 'bar' } },
  { id: 2, type: 'foo', attributes: { name: 'chad' } },
  { id: 3, type: 'foo', attributes: { name: 'dave' } },
  { id: 4, type: 'foo', attributes: { name: 'bar second' } }
];

moduleForComponent('model-picker', 'Integration | Component | {{model-picker}}', {
  integration: true,
  setup() {
    new Pretender(function() {
      this.get('/foos', function(request) {
        let filter = request.queryParams.name;
        let amount = request.queryParams.per_page || 300;

        let filteredContent = FOOS;

        if (filter) {
          filteredContent = FOOS.filter((foo) => {
            return foo.attributes.name.indexOf(filter) !== -1;
          });
        }

        filteredContent = filteredContent.slice(0, amount);

        let content = JSON.stringify({ data: filteredContent });

        return [200, { 'Content-Type': 'application/json' }, content];
      });
    });
  }
});

test('Searches for given model by attribute', function(assert) {
  let done = assert.async();

  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  clickTrigger();

  let $input = $('.ember-power-select-dropdown input');
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

test('Pre-loads content on preload=true', function(assert) {
  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 preload=true
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  clickTrigger();

  return wait()
    .then(() => {
      let $items = $('.ember-power-select-dropdown li');

      assert.equal($items.length, 4, 'gets all objects of type on preload');
      assert.equal($items[0].innerText, 'bar');
      assert.equal($items[1].innerText, 'chad');
      assert.equal($items[2].innerText, 'dave');
      assert.equal($items[3].innerText, 'bar second');

      return wait();
    })
    .then(() => {
      let $input = $('.ember-power-select-dropdown input');
      $input.val('bar');
      $input.trigger('input');

      return wait();
    })
    .then(() => {
      let $items = $('.ember-power-select-dropdown li');

      assert.equal($items.length, 2, 'finds searched model by label');
      assert.equal($items[0].innerText, 'bar', 'first item');
      assert.equal($items[1].innerText, 'bar second', 'second item');
    });
});

test('Pre-loads amount of objects given to preload', function(assert) {
  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 preload=2
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  clickTrigger();

  return wait()
    .then(() => {
      let $items = $('.ember-power-select-dropdown li');

      assert.equal($items.length, 2, 'gets given amount of objects');
      assert.equal($items[0].innerText, 'bar');
      assert.equal($items[1].innerText, 'chad');

      return wait();
    });
});

test('Pre-loads and queries again on search when queryOnSearch=true',
function(assert) {
  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 preload=2
                                 queryOnSearch=true
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  clickTrigger();

  return wait()
    .then(() => {
      let $items = $('.ember-power-select-dropdown li');

      assert.equal($items.length, 2, 'gets given amount of objects');

      return wait();
    })
    .then(() => {
      let $input = $('.ember-power-select-dropdown input');
      $input.val('dave');
      $input.trigger('input');

      return wait();
    })
    .then(() => {
      let $items = $('.ember-power-select-dropdown li');

      assert.equal($items.length, 1, 'finds searched model after preload');
      assert.equal($items[0].innerText, 'dave');
    });
});

test('Sorts list using given sorting function', function(assert) {
  let done = assert.async();

  set(this, 'customSorting', function(a, b) {
    return compare(get(a, 'name'), get(b, 'name'));
  });

  this.on('update', () => { });
  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 sortFunction=customSorting
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  clickTrigger();

  let $input = $('.ember-power-select-dropdown input');
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
  set(this, 'currentFoo', EmberObject.create({ id: 6, name: 'bar test' }));
  this.on('update', () => { });
  this.render(hbs`{{model-picker value=currentFoo
                                 updated=(action 'update')
                                 model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  let $selectedOption = getSelected();
  assert.equal($selectedOption[0].innerText.indexOf('bar test'), 0);
});
