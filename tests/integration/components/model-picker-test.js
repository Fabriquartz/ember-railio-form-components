/* eslint-disable camelcase */
import Ember                                          from 'ember';
import EmberObject                                    from 'ember-object';
import Service                                        from 'ember-service';
import Pretender                                      from 'pretender';
import { module, test }                               from 'qunit';
import { setupRenderingTest }                         from 'ember-qunit';
import { render, findAll, find, triggerEvent, click,
  fillIn } from '@ember/test-helpers';

import {
  getSelected,
  clickTrigger,
  clickItem,
  typeInSearch } from '../../helpers/ember-power-select';

import hbs  from 'htmlbars-inline-precompile';
import get  from 'ember-metal/get';
import set  from 'ember-metal/set';
import $    from 'jquery';
import wait from 'ember-test-helpers/wait';

const { compare } = Ember;

const FOOS = [
  { id: 1, type: 'foo', attributes: { name: 'chad' } },
  { id: 2, type: 'foo', attributes: { name: 'bar' } },
  { id: 3, type: 'foo', attributes: { name: 'dave' } },
  { id: 4, type: 'foo', attributes: { name: 'bar second' } }
];

module('Integration | Component | {{model-picker}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.before(function() {
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
  });

  hooks.beforeEach(function() {
    this.actions = {};
    this.actions.update = function() { };
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('Renders with classes and given placeholder', async function(assert) {
    await render(hbs`{{model-picker model="foo"
                                   optionLabelPath="name"
                                   searchProperty="name"
                                   prompt="Prompt text"}}`);

    assert.equal(findAll('.model-picker').length, 1,
                 'renders with model-picker class');
    assert.equal(find('.ember-power-select-placeholder').textContent.trim(),
                 'Prompt text', 'renders with given prompt as placeholder');
  });

  test('Searches for given model by attribute', async function(assert) {
    await render(hbs`{{model-picker updated=(action 'update')
                                    model="foo"
                                    optionLabelPath="name"
                                    searchProperty="name"}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-options li');

    assert.equal($items.length, 1, 'by default no content');
    assert.equal($items[0].textContent.trim(), 'Type to search');

    await typeInSearch('bar');

    $items = $('.ember-power-select-options li');

    assert.equal($items.length, 2, 'finds searched model by label');
    assert.equal($items[0].textContent.trim(), 'bar', 'first item');
    assert.equal($items[1].textContent.trim(), 'bar second', 'second item');
    await clickTrigger();
  });

  test('Pre-loads content on preload=true', async function(assert) {
    await render(hbs`{{model-picker updated=(action 'update')
                                   model="foo"
                                   preload=true
                                   optionLabelPath="name"
                                   searchProperty="name"}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 4, 'gets all objects of type on preload');
    assert.equal($items[0].textContent.trim(), 'chad');
    assert.equal($items[1].textContent.trim(), 'bar');
    assert.equal($items[2].textContent.trim(), 'dave');
    assert.equal($items[3].textContent.trim(), 'bar second');

    await fillIn('.ember-power-select-dropdown input', 'bar');

    $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 2, 'finds searched model by label');
    assert.equal($items[0].textContent.trim(), 'bar', 'first item');
    assert.equal($items[1].textContent.trim(), 'bar second', 'second item');
    await clickTrigger();
  });

  test('Pre-loads amount of objects given to preload', async function(assert) {
    await render(hbs`{{model-picker updated=(action 'update')
                                   model="foo"
                                   preload=2
                                   optionLabelPath="name"
                                   searchProperty="name"}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 2, 'gets given amount of objects');
    assert.equal($items[0].textContent.trim(), 'chad');
    assert.equal($items[1].textContent.trim(), 'bar');

  });

  test('Pre-loads and queries again on search when queryOnSearch=true',
  async function(assert) {
    await render(hbs`{{model-picker updated=(action 'update')
                                   model="foo"
                                   preload=2
                                   queryOnSearch=true
                                   optionLabelPath="name"
                                   searchProperty="name"}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 2, 'gets given amount of objects');

    await fillIn('.ember-power-select-dropdown input', 'dave');

    await triggerEvent('.ember-power-select-dropdown input', 'input');

    $items = $('.ember-power-select-dropdown li');

    assert.equal($items.length, 1, 'finds searched model after preload');
    assert.equal($items[0].textContent.trim(), 'dave');
    await clickTrigger();
  });

  test('Uses given filters on query', async function(assert) {
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

    this.set('store', {
      query(modelName, query) {
        assert.equal(modelName, 'foo', 'queries with given modelName');
        queryExpects(query);
        return;
      }
    });

    await render(hbs`{{model-picker updated=(action 'update')
                                    model="foo"
                                    preload=50
                                    queryOnSearch=true
                                    searchProperty="name_cont"
                                    store=store
                                    filter=filters}}`);

    queryExpects = (query) => {
      assert.notOk(query.per_page, 'No preload amount on searching');
      assert.equal(query.filter.foo_eq,    'bar',  'queries with filter');
      assert.equal(query.filter.code_cont, 'test', 'queries with filter');
      assert.equal(query.name_cont, 'bla', 'queries with search query');
    };

    await clickTrigger();
    await fillIn('.ember-power-select-dropdown input', 'bla');
    await clickTrigger();
    return wait();
  });

  test('Sorts preloaded list using given sorting function', async function(assert) {
    set(this, 'customSorting', function(a, b) {
      return compare(get(a, 'name'), get(b, 'name'));
    });

    await render(hbs`{{model-picker updated=(action 'update')
                                   model="foo"
                                   preload=2
                                   sortFunction=customSorting
                                   optionLabelPath="name"
                                   searchProperty="name"}}`);

    await clickTrigger();

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items[0].textContent.trim(), 'bar',  'preloaded item 1 sorted');
    assert.equal($items[1].textContent.trim(), 'chad', 'preloaded item 2 sorted');
    await clickTrigger();
  });

  test('Sorts queried list using given sorting function', async function(assert) {
    set(this, 'customSorting', function(a, b) {
      return compare(get(a, 'name'), get(b, 'name'));
    });

    await render(hbs`{{model-picker updated=(action 'update')
                                   model="foo"
                                   sortFunction=customSorting
                                   optionLabelPath="name"
                                   searchProperty="name"}}`);

    await clickTrigger();
    await fillIn('.ember-power-select-dropdown input', 'a');

    let $items = $('.ember-power-select-dropdown li');

    assert.equal($items[0].textContent.trim(), 'bar',
      'reloaded first item sorted');
    assert.equal($items[1].textContent.trim(), 'bar second',
      'reloaded second item sorted');
    assert.equal($items[2].textContent.trim(), 'chad',
      'reloaded third item sorted');
    assert.equal($items[3].textContent.trim(), 'dave',
      'reloaded fourth item sorted');
    await clickTrigger();
  });

  test('Shows selected item', async function(assert) {
    set(this, 'currentFoo', EmberObject.create({ id: 6, name: 'bar test' }));
    await render(hbs`{{model-picker value=currentFoo
                                    updated=(action 'update')
                                    model="foo"
                                    optionLabelPath="name"
                                    searchProperty="name"}}`);

    let $selectedOption = getSelected();
    assert.equal($selectedOption[0].textContent.trim().indexOf('bar test'), 0);
    await clickTrigger();
  });

  test('selectAll true when already everything selected', async function(assert) {
    this.set('selection', [{}, {}, {}, {}]);

    this.set('store', { query() { return FOOS; } });

    await render(hbs`{{model-picker value=selection
                                   model="foo"
                                   multiSelect=true
                                   enableSelectAll=true
                                   preload=true
                                   updated=(action 'update')
                                   optionLabelPath="name"
                                   searchProperty="name"
                                   store=store}}`);

    let $selectAll = $('.auto-complete__select-all');

    assert.equal($selectAll[0].checked, false,
                  'not selected all when different value than content');
    this.set('selection', FOOS);
    assert.equal($selectAll[0].checked, true,
                  'all selected when current value equals content');
    await clickTrigger();
  });

  test('selectAll does not show all selected values', async function(assert) {
    this.owner.register('service:store', Service.extend({
      query() { return FOOS; }
    }));

    this.actions.updated = (value) => this.set('selection', value);

    await render(hbs`{{model-picker value=selection
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

    assert.notOk($selectAll[0].checked,
                'not selected all when different value than content');
    assert.equal($input.attr('placeholder'), 'Prompt text',
                  'By default given prompt as placeholder');

    await click('.auto-complete__select-all');

    let $options = $('.ember-power-select-multiple-option');

    assert.ok($selectAll[0].checked, 'all selected when clicked');
    assert.equal($options.length, 0, 'Does not show all selected items');
    assert.equal($input.attr('placeholder'), 'Selected all',
                  'input indicates all options are selected');

    await clickTrigger();
    clickItem(2);
    assert.notOk($selectAll[0].checked, 'no select all on clicking item');
    await clickTrigger();
  });
});
