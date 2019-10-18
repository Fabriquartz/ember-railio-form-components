import EmberObject            from '@ember/object';
import { run }                from '@ember/runloop';
import { render }             from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs                    from 'htmlbars-inline-precompile';
import { module, test }       from 'qunit';

module('Integration | Component | {{form-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send    = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.actions.update = function(object, propertyPath, value) {
      object.set(propertyPath, value);
    };
  });

  test(`Renders a div with class 'form-field'`, async function(assert) {
    await render(hbs`{{form-field updated=(action 'update')}}`);

    let $component = this.$('div.form-field');
    assert.equal($component.length, 1);
  });

  test(`By default shows propertyPath as label`, async function(assert) {
    await render(hbs`{{form-field propertyPath="number"
                                  updated=(action 'update')}}`);

    let $labels = this.$('.form-field').find('label');

    assert.equal($labels.length, 1, 'shows a label');

    let labelText = $labels.text();
    assert.equal(labelText, 'Number', 'label is same as propertyPath');
  });

  test(`Splices label on camelcase`, async function(assert) {
    await render(hbs`{{form-field propertyPath="numberValue"
                                  updated=(action 'update')}}`);

    let labelText = this.$('.form-field')
      .find('label')
      .text();

    assert.equal(labelText, 'Number value');
  });

  test(`Shows no label when label=false`, async function(assert) {
    await render(hbs`{{form-field label=false
                                  updated=(action 'update')}}`);

    let $labels = this.$('.form-field').find('label');

    assert.equal($labels.length, 0);
  });

  test(`Shows given String as label`, async function(assert) {
    await render(hbs`{{form-field label="Object nr."
                                  updated=(action 'update')}}`);

    let labelText = this.$('.form-field')
      .find('label')
      .text();

    assert.equal(labelText, 'Object nr.');
  });

  test(`Gets class 'invalid' when object.errors.propertyPath has errors`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        errors: EmberObject.create({
          numberValue: ['first error message']
        })
      })
    );

    await render(hbs`{{form-field object=object
                                 propertyPath="numberValue"
                                 updated=(action 'update')}}`);

    let $component = this.$('.form-field');

    assert.ok($component.hasClass('form-field--invalid'));

    run(() => this.set('object.errors.numberValue', null));

    assert.ok(!$component.hasClass('form-field--invalid'));
  });

  test(`Gets class 'changed' when value is unsaved`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        numberValueIsChanged: true
      })
    );

    await render(hbs`{{form-field object=object
                                 propertyPath="numberValue"
                                 updated=(action 'update')}}`);

    let $component = this.$('.form-field');
    assert.ok($component.hasClass('form-field--changed'));

    run(() => this.set('object.numberValueIsChanged', false));

    assert.ok(!$component.hasClass('form-field--changed'));
  });

  test(`Gets class 'changed' when origin value is unsaved`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        numberIsChanged: true
      })
    );

    await render(hbs`
      {{form-field object=object
                   originPath="number"
                   propertyPath="numberValue"
                   updated=(action 'update')}}`);

    let $component = this.$('.form-field');
    assert.ok($component.hasClass('form-field--changed'));
  });

  test(`Gets class 'different' when values are different`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        numberValueIsDifferent: true
      })
    );

    await render(hbs`{{form-field object=object
                                 propertyPath="numberValue"
                                 updated=(action 'update')}}`);

    let $component = this.$('.form-field');
    assert.ok($component.hasClass('form-field--different'));

    run(() => this.set('object.numberValueIsDifferent', false));

    assert.ok(!$component.hasClass('form-field--different'));
  });

  test(`Shows a given template and aliasses value`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        stringValue: 'Value string'
      })
    );

    await render(hbs`
      {{#form-field object=object
                    updated=(action 'update')
                    propertyPath="stringValue" as |value|}}
        <div class="aGivenTemplateClass">{{value}}</div>
      {{/form-field}}`);

    let $template = this.$('.form-field').find('.aGivenTemplateClass');
    assert.equal($template.length, 1, 'shows the given template');

    let templateText = $template.text();
    assert.equal(templateText, 'Value string', 'shows aliasses value');
  });

  test(`Passes update action to block template`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        stringValue: 'Value string'
      })
    );
    this.actions.update = function(object, propertyPath, value) {
      object.set(propertyPath, value);
    };

    await render(hbs`
      {{#form-field updated=(action "update")
                    object=object
                    propertyPath="stringValue"
                    as |value updated|}}
        {{text-field value=value updated=updated}}
      {{/form-field}}`);

    let $input = this.$('input');

    run(() => {
      $input.val('Another value');
      $input.trigger('input');
    });

    assert.equal(this.get('object.stringValue'), 'Another value');
  });

  test(`Shows a component depending on the given type`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        name: 'John White'
      })
    );

    await render(hbs`
      {{form-field type="text-field"
                   object=object
                   propertyPath="name"
                   updated=(action 'update')}}`);

    let $input = this.$('.form-field').find('input.text-field');
    assert.equal($input.length, 1, 'shows the component depending on given type');

    let inputText = $input.val();
    assert.equal(inputText, 'John White', 'shown component has correct value');
  });

  test(`passes the name to the form field`, async function(assert) {
    this.set(
      'object',
      EmberObject.create({
        name: 'John White'
      })
    );

    await render(hbs`
      {{form-field type="text-field"
                   object=object
                   propertyPath="name"
                   name="person-name"
                   updated=(action 'update')}}`);

    let $input = this.$('input.text-field');
    assert.equal($input.attr('name'), 'person-name', 'passes name to component');
  });

  test(`The component doesn't update the value, but calls an action`, async function(assert) {
    assert.expect(6);

    let person = EmberObject.create({
      name: 'John White'
    });

    this.set('object', person);

    this.actions.update = function(object, propertyPath, value, event) {
      assert.equal(object, person, 'update function gets right object');
      assert.equal(propertyPath, 'name', 'update function gets right propertyPath');
      assert.equal(value, 'John Black', 'update function gets new value');
      assert.equal(event.handleObj.type, 'input', 'Event is passed as fourth element');
    };

    await render(hbs`
      {{form-field type="text-field"
                   object=object
                   propertyPath="name"
                   updated=(action "update")}}`);

    let $input = this.$('.form-field').find('input.text-field');

    run(() => {
      $input.val('John Black');
      $input.trigger('input');
    });

    assert.equal($input.val(), 'John Black', 'changes the input value');
    assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
  });
});
