import { moduleForComponent, test } from 'ember-qunit';
import EmberObject from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

import $ from 'jquery';

moduleForComponent('form-field', 'Integration | Component | {{form-field}}', {
  integration: true,
  beforeEach() {
    this.on('update', function(object, propertyPath, value) {
      object.set(propertyPath, value);
    });
  }
});

test(`Renders a div with class 'form-field'`, function(assert) {
  this.render(hbs `{{form-field updated=(action 'update')}}`);

  let $component = $('div.form-field');
  assert.equal($component.length, 1);
});

test(`By default shows propertyPath as label`, function(assert) {
  this.render(hbs `{{form-field propertyPath="number"
                                updated=(action 'update')}}`);

  let $labels = $('.form-field').find('label');

  assert.equal($labels.length, 1, 'shows a label');

  let labelText = $labels.text();
  assert.equal(labelText, 'Number', 'label is same as propertyPath');
});

test(`Splices label on camelcase`, function(assert) {
  this.render(hbs `{{form-field propertyPath="numberValue"
                                updated=(action 'update')}}`);

  let labelText  = $('.form-field').find('label').text();

  assert.equal(labelText, 'Number value');
});

test(`Shows no label when label=false`, function(assert) {
  this.render(hbs `{{form-field label=false
                                updated=(action 'update')}}`);

  let $labels = $('.form-field').find('label');

  assert.equal($labels.length, 0);
});

test(`Shows given String as label`, function(assert) {
  this.render(hbs `{{form-field label="Object nr."
                                updated=(action 'update')}}`);

  let labelText  = $('.form-field').find('label').text();

  assert.equal(labelText, 'Object nr.');
});

test(`Gets class 'invalid' when object.errors.propertyPath has errors`,
function(assert) {
  this.set('object', EmberObject.create({
    errors: EmberObject.create({
      numberValue: ['first error message']
    })
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  let $component = $('.form-field');

  assert.ok($component.hasClass('form-field--invalid'));

  run(() => this.set('object.errors.numberValue', null));

  assert.ok(!$component.hasClass('form-field--invalid'));
});

test(`Gets class 'changed' when value is unsaved`, function(assert) {
  this.set('object', EmberObject.create({
    numberValueIsChanged: true
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  let $component = $('.form-field');
  assert.ok($component.hasClass('form-field--changed'));

  run(() => this.set('object.numberValueIsChanged', false));

  assert.ok(!$component.hasClass('form-field--changed'));
});

test(`Gets class 'changed' when origin value is unsaved`, function(assert) {
  this.set('object', EmberObject.create({
    numberIsChanged: true
  }));

  this.render(hbs`
    {{form-field object=object
                 originPath="number"
                 propertyPath="numberValue"
                 updated=(action 'update')}}`);

  let $component = $('.form-field');
  assert.ok($component.hasClass('form-field--changed'));
});

test(`Gets class 'different' when values are different`, function(assert) {
  this.set('object', EmberObject.create({
    numberValueIsDifferent: true
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  let $component = $('.form-field');
  assert.ok($component.hasClass('form-field--different'));

  run(() => this.set('object.numberValueIsDifferent', false));

  assert.ok(!$component.hasClass('form-field--different'));
});

test(`Shows a given template and aliasses value`, function(assert) {
  this.set('object', EmberObject.create({
    stringValue: 'Value string'
  }));

  this.render(hbs`
    {{#form-field object=object
                  updated=(action 'update')
                  propertyPath="stringValue" as |value|}}
      <div class="aGivenTemplateClass">{{value}}</div>
    {{/form-field}}`);

  let $template = $('.form-field').find('.aGivenTemplateClass');
  assert.equal($template.length, 1, 'shows the given template');

  let templateText = $template.text();
  assert.equal(templateText, 'Value string', 'shows aliasses value');
});

test(`Passes update action to block template`, function(assert) {
  this.set('object', EmberObject.create({
    stringValue: 'Value string'
  }));
  this.on('update', function(object, propertyPath, value) {
    object.set(propertyPath, value);
  });

  this.render(hbs`
    {{#form-field updated=(action "update")
                  object=object
                  propertyPath="stringValue"
                  as |value updated|}}
      {{text-field value=value updated=updated}}
    {{/form-field}}`);

  let $input = $('input');

  run(() => {
    $input.val('Another value');
    $input.trigger('input');
  });

  assert.equal(this.get('object.stringValue'), 'Another value');
});

test(`Shows a component depending on the given type`, function(assert) {
  this.set('object', EmberObject.create({
    name: 'John White'
  }));

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 updated=(action 'update')}}`);

  let $input = $('.form-field').find('input.text-field');
  assert.equal($input.length, 1, 'shows the component depending on given type');

  let inputText = $input.val();
  assert.equal(inputText, 'John White', 'shown component has correct value');
});

test(`passes the name to the form field`, function(assert) {
  this.set('object', EmberObject.create({
    name: 'John White'
  }));

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 name="person-name"
                 updated=(action 'update')}}`);

  let $input = $('input.text-field');
  assert.equal($input.attr('name'), 'person-name', 'passes name to component');
});

test(`The component doesn't update the value, but calls an action`,
function(assert) {
  assert.expect(6);

  let person = EmberObject.create({
    name: 'John White'
  });

  this.set('object', person);

  this.on('update', function(object, propertyPath, value, event) {
    assert.equal(object, person, 'update function gets right object');
    assert.equal(propertyPath, 'name', 'update function gets right propertyPath');
    assert.equal(value, 'John Black', 'update function gets new value');
    assert.equal(event.handleObj.type, 'input', 'Event is passed as fourth element');
  });

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 updated=(action "update")}}`);

  let $input = $('.form-field').find('input.text-field');

  run(() => {
    $input.val('John Black');
    $input.trigger('input');
  });

  assert.equal($input.val(), 'John Black', 'changes the input value');
  assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
});
