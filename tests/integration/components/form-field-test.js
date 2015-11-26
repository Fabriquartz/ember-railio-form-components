import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('form-field', 'Integration | Component | {{form-field}}', {
  integration: true,
  beforeEach: function() {
    this.on('update', function(object, propertyPath, value) {
      object.set(propertyPath, value);
    });
  }
});

test(`Renders a div with class 'form-field'`, function(assert) {
  this.render(hbs `{{form-field updated=(action 'update')}}`);

  const $component = this.$('div.form-field');
  assert.equal($component.length, 1);
});

test(`By default shows propertyPath as label`, function(assert) {
  this.render(hbs `{{form-field propertyPath="number"
                                updated=(action 'update')}}`);

  const $labels = this.$('.form-field').find('label');

  assert.equal($labels.length, 1, 'shows a label');

  const labelText = $labels.text();
  assert.equal(labelText, 'Number', 'label is same as propertyPath');
});

test(`Splices label on camelcase`, function(assert) {
  this.render(hbs `{{form-field propertyPath="numberValue"
                                updated=(action 'update')}}`);

  const labelText  = this.$('.form-field').find('label').text();

  assert.equal(labelText, 'Number value');
});

test(`Shows no label when label=false`, function(assert) {
  this.render(hbs `{{form-field label=false
                                updated=(action 'update')}}`);

  const $labels = this.$('.form-field').find('label');

  assert.equal($labels.length, 0);
});

test(`Shows given String as label`, function(assert) {
  this.render(hbs `{{form-field label="Object nr."
                                updated=(action 'update')}}`);

  const labelText  = this.$('.form-field').find('label').text();

  assert.equal(labelText, 'Object nr.');
});

test(`Gets class 'invalid' when object.errors.propertyPath has errors`, function(assert) {
  this.set('object', Ember.Object.create({
    errors: Ember.Object.create({
      numberValue: ['first error message']
    })
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  const $component = this.$('.form-field');

  assert.ok($component.hasClass('form-field--invalid'));

  run(() => this.set('object.errors.numberValue', null));

  assert.ok(!$component.hasClass('form-field--invalid'));
});

test(`Gets class 'changed' when value is unsaved`, function(assert) {
  this.set('object', Ember.Object.create({
    numberValueIsChanged: true
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  const $component = this.$('.form-field');
  assert.ok($component.hasClass('form-field--changed'));

  run(() => this.set('object.numberValueIsChanged', false));

  assert.ok(!$component.hasClass('form-field--changed'));
});

test(`Gets class 'changed' when origin value is unsaved`, function(assert) {
  this.set('object', Ember.Object.create({
    numberIsChanged: true
  }));

  this.render(hbs`
    {{form-field object=object
                 originPath="number"
                 propertyPath="numberValue"
                 updated=(action 'update')}}`);

  const $component = this.$('.form-field');
  assert.ok($component.hasClass('form-field--changed'));
});

test(`Gets class 'different' when values are different`, function(assert) {
  this.set('object', Ember.Object.create({
    numberValueIsDifferent: true
  }));

  this.render(hbs`{{form-field object=object
                               propertyPath="numberValue"
                               updated=(action 'update')}}`);

  const $component = this.$('.form-field');
  assert.ok($component.hasClass('form-field--different'));

  run(() => this.set('object.numberValueIsDifferent', false));

  assert.ok(!$component.hasClass('form-field--different'));
});

test(`Shows a given template and aliasses value`, function(assert) {
  this.set('object', Ember.Object.create({
    stringValue: 'Value string'
  }));

  this.render(hbs`
    {{#form-field object=object
                  updated=(action 'update')
                  propertyPath="stringValue" as |value|}}
      <div class="aGivenTemplateClass">{{value}}</div>
    {{/form-field}}`);

  const $template = this.$('.form-field').find('.aGivenTemplateClass');
  assert.equal($template.length, 1, 'shows the given template');

  const templateText = $template.text();
  assert.equal(templateText, 'Value string', 'shows aliasses value');
});

test(`Passes update action to block template`, function(assert) {
  this.set('object', Ember.Object.create({
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

  const $input = this.$('input');

  run(() => {
    $input.val('Another value');
    $input.trigger('input');
  });

  assert.equal(this.get('object.stringValue'), 'Another value');
});

test(`Shows a component depending on the given type`, function(assert) {
  this.set('object', Ember.Object.create({
    name: 'John White'
  }));

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 updated=(action 'update')}}`);

  const $input = this.$('.form-field').find('input.text-field');
  assert.equal($input.length, 1, 'shows the component depending on given type');

  const inputText = $input.val();
  assert.equal(inputText, 'John White', 'shown component has correct value');
});

test(`passes the name to the form field`, function(assert) {
  this.set('object', Ember.Object.create({
    name: 'John White'
  }));

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 name="person-name"
                 updated=(action 'update')}}`);

  const $input = this.$('input.text-field');
  assert.equal($input.attr('name'), 'person-name', 'passes name to component');
});

test(`The component doesn't update the value, but calls an action`, function(assert) {
  assert.expect(5);

  const person = Ember.Object.create({
    name: 'John White'
  });

  this.set('object', person);

  this.on('update', function(object, propertyPath, value) {
    assert.equal(object, person, 'update function gets the right object');
    assert.equal(propertyPath, 'name', 'update function gets the right propertyPath');
    assert.equal(value, 'John Black', 'update function gets the new value');
  });

  this.render(hbs`
    {{form-field type="text-field"
                 object=object
                 propertyPath="name"
                 updated=(action "update")}}`);

  const $input = this.$('.form-field').find('input.text-field');

  run(() => {
    $input.val('John Black');
    $input.trigger('input');
  });

  assert.equal($input.val(), 'John Black', 'changes the input value');
  assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
});
