import { moduleForComponent, test, skip } from 'ember-qunit';
import EmberObject from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import $ from 'jquery';

moduleForComponent('text-area', 'Integration | Component | {{text-area}}', {
  integration: true
});

test('renders a text-area with value', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-area value=value}}`);

  let $area = $('textarea.text-area');
  assert.equal($area.length, 1, 'renders a textarea with class text-area');

  assert.equal($area.val(), 'testing');
});

// Skipped because test fails on Travis, but runs locally
skip('Sizes with input', function(assert) {
  let chromeTextAreaMargin = 4;
  let lineHeight = 25;

  this.set('value', 'This is the 1st line');

  this.render(hbs`{{text-area value=value
                              sizeOnInput=true}}`);

  let $area = $('textarea.text-area');

  $area.attr('style', `line-height: ${lineHeight}px; width: 150px;
                       font-family: monospace; font-size: 10px;`);

  function updateArea(append) {
    run(() => {
      let val = $area.val();
      $area.val(`${val}${append}`);
      $area.trigger('input');
    });
  }

  updateArea('');

  assert.equal($area.height(), (1 * lineHeight) + chromeTextAreaMargin,
               'Resizes for first line');

  updateArea('This is the 2nd line');

  assert.equal($area.height(), (2 * lineHeight) + chromeTextAreaMargin,
               'Resizes for second line');

  updateArea('This is the 3rd line');

  assert.equal($area.height(), (3 * lineHeight) + chromeTextAreaMargin,
               'Resizes for third line');
});

test(`typing doesn't change value but sends updated`, function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-area value=value updated=(action "update")}}`);

  let $input = $('.text-area');

  run(() => {
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), '');
});

test('works with form-field', function(assert) {
  assert.expect(5);

  let person = EmberObject.create({
    name: 'John White'
  });

  this.set('object', person);

  this.on('update', function(object, propertyPath, value) {
    assert.equal(object, person, 'update function gets right object');
    assert.equal(propertyPath, 'name', 'update function gets right propertyPath');
    assert.equal(value, 'John Black', 'update function gets new value');
  });

  this.render(hbs`
    {{form-field type="text-area"
                 object=object
                 propertyPath="name"
                 updated=(action "update")}}`);

  let $textarea = $('.form-field').find('textarea.text-area');

  run(() => {
    $textarea.val('John Black');
    $textarea.trigger('input');
  });

  assert.equal($textarea.val(), 'John Black', 'changes the input value');
  assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
});
