/* eslint-disable camelcase */
import Ember       from 'ember';
import EmberObject from 'ember-object';
import Service     from 'ember-service';
import Pretender   from 'pretender';

import { moduleForComponent, test } from 'ember-qunit';

import {
  getSelected,
  clickTrigger,
  clickItem } from '../../helpers/ember-power-select';

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
    this.on('update', () => { });

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

test('Renders with classes and given placeholder', function(assert) {
  this.render(hbs`{{model-picker model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"
                                 prompt="Prompt text"
                                 updated=(action 'update')}}`);

  assert.equal(this.$('.model-picker').length, 1,
               'renders with model-picker class');
  assert.equal(this.$('.ember-power-select-placeholder').text().trim(),
               'Prompt text', 'renders with given prompt as placeholder');
});

test('Searches for given model by attribute', function(assert) {
  let done = assert.async();

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

test('Uses given filters on query', function(assert) {
  assert.expect(9);

  set(this, 'filters', {
    foo_eq:    'bar',
    code_cont: 'test'
  });

  let queryExpects = (query) => {
    assert.equal(query.per_page,  50,    'queries with preload amount');
    assert.equal(query.filter.foo_eq,    'bar',  'queries with filter');
    assert.equal(query.filter.code_cont, 'test', 'queries with filter');
  };

  this.register('service:store', Service.extend({
    query(modelName, query) {
      assert.equal(modelName, 'foo', 'queries with given modelName');
      queryExpects(query);
      return;
    }
  }));

  this.render(hbs`{{model-picker updated=(action 'update')
                                 model="foo"
                                 preload=50
                                 queryOnSearch=true
                                 searchProperty="name_cont"
                                 filter=filters}}`);

  queryExpects = (query) => {
    assert.notOk(query.per_page, 'No preload amount on searching');
    assert.equal(query.filter.foo_eq,    'bar',  'queries with filter');
    assert.equal(query.filter.code_cont, 'test', 'queries with filter');
    assert.equal(query.name_cont, 'bla', 'queries with search query');
  };

  clickTrigger();

  return wait().then(() => {
    let $input = $('.ember-power-select-dropdown input');
    $input.val('bla');
    $input.trigger('input');

    return wait();
  });
});

test('Sorts list using given sorting function', function(assert) {
  let done = assert.async();

  set(this, 'customSorting', function(a, b) {
    return compare(get(a, 'name'), get(b, 'name'));
  });

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
  this.render(hbs`{{model-picker value=currentFoo
                                 updated=(action 'update')
                                 model="foo"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  let $selectedOption = getSelected();
  assert.equal($selectedOption[0].innerText.indexOf('bar test'), 0);
});

test('selectAll true when already everything selected', function(assert) {
  this.set('selection', [{}, {}, {}, {}]);

  this.register('service:store', Service.extend({
    query() { return FOOS; }
  }));

  this.render(hbs`{{model-picker value=selection
                                 model="foo"
                                 multiSelect=true
                                 enableSelectAll=true
                                 preload=true
                                 updated=(action 'update')
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  let $selectAll = $('.auto-complete__select-all');

  return wait().then(() => {
    assert.equal($selectAll[0].checked, false,
                 'not selected all when different value than content');
    return wait();
  }).then(() => {
    this.set('selection', FOOS);
    return wait();
  }).then(() => {
    assert.equal($selectAll[0].checked, true,
                 'all selected when current value equals content');
    return wait();
  });
});

test('selectAll does not show all selected values', function(assert) {
  this.register('service:store', Service.extend({
    query() { return FOOS; }
  }));

  this.on('updated', (value) => this.set('selection', value));

  this.render(hbs`{{model-picker value=selection
                                 model="foo"
                                 multiSelect=true
                                 enableSelectAll=true
                                 preload=true
                                 updated=(action 'update')
                                 prompt="Prompt text"
                                 optionLabelPath="name"
                                 searchProperty="name"}}`);

  let $selectAll = $('.auto-complete__select-all');
  let $input     = $('input.ember-power-select-trigger-multiple-input');

  return wait().then(() => {
    assert.notOk($selectAll[0].checked,
                'not selected all when different value than content');
    assert.equal($input.attr('placeholder'), 'Prompt text',
                 'By default given prompt as placeholder');

    $selectAll.click();
    return wait();
  }).then(() => {
    let $options = $('.ember-power-select-multiple-option');

    assert.ok($selectAll[0].checked, 'all selected when clicked');
    assert.equal($options.length, 0, 'Does not show all selected items');
    assert.equal($input.attr('placeholder'), 'Selected all',
                 'input indicates all options are selected');

    clickTrigger();
    clickItem(2);
    return wait();
  }).then(() => {
    assert.notOk($selectAll[0].checked, 'no select all on clicking item');

    return wait();
  });
});
