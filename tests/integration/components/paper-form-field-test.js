import { module, test }       from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn }     from '@ember/test-helpers';
import EmberObject            from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

module('Integration | Component | {{paper-form-field}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = { update: (object, propertyPath, value) => {
      object.set(propertyPath, value);
    } };
  });

  test(`Renders a div with class 'form-field'`, async function(assert) {
    await render(hbs `{{paper-form-field updated=(action 'update')}}`);

    let $component = this.element.querySelectorAll('div.form-field');
    assert.equal($component.length, 1);
  });

  test(`By default shows propertyPath as label`, async function(assert) {
    await render(hbs `{{paper-form-field propertyPath="number"
                                         type="text-field"
                                         updated=(action 'update')}}`);

    let $labels = this.element.querySelectorAll('label');
    assert.equal($labels.length, 1, 'shows a label');

    let labelText = $labels[0].textContent;
    assert.equal(labelText, 'Number', 'label is same as propertyPath');
  });

  test(`Splices label on camelcase`, async function(assert) {
    await render(hbs `{{paper-form-field propertyPath="numberValue"
                                         type="text-field"
                                         updated=(action 'update')}}`);

    let labelText  = this.element.querySelector('label').textContent;

    assert.equal(labelText, 'Number value');
  });

  test(`Shows no label when label=false`, async function(assert) {
    await render(hbs `{{paper-form-field label=false
                                         type="text-field"
                                         updated=(action 'update')}}`);

    let $labels = this.element.querySelectorAll('label');

    assert.equal($labels.length, 0);
  });

  test(`Shows given String as label`, async function(assert) {
    await render(hbs `{{paper-form-field label="Object nr."
                                         type="text-field"
                                         updated=(action 'update')}}`);

    let labelText  = this.element.querySelector('label').textContent;

    assert.equal(labelText, 'Object nr.');
  });

  test(`Gets class 'invalid' when object.errors.propertyPath has errors`,
  async function(assert) {
    this.set('object', EmberObject.create({
      errors: EmberObject.create({
        numberValue: ['first error message']
      })
    }));

    await render(hbs`{{paper-form-field object=object
                                        propertyPath="numberValue"
                                        updated=(action 'update')}}`);

    let $component = this.element.querySelector('.form-field');

    assert.ok($component.classList.contains('form-field--invalid'));

    run(() => this.set('object.errors.numberValue', null));

    assert.ok(!$component.classList.contains('form-field--invalid'));
  });

  test(`Gets class 'changed' when value is unsaved`, async function(assert) {
    this.set('object', EmberObject.create({
      numberValueIsChanged: true
    }));

    await render(hbs`{{paper-form-field object=object
                                        propertyPath="numberValue"
                                        updated=(action 'update')}}`);

    let $component = this.element.querySelector('.form-field');
    assert.ok($component.classList.contains('form-field--changed'));

    run(() => this.set('object.numberValueIsChanged', false));

    assert.ok(!$component.classList.contains('form-field--changed'));
  });

  test(`Gets class 'changed' when origin value is unsaved`, async function(assert) {
    this.set('object', EmberObject.create({
      numberIsChanged: true
    }));

    await render(hbs`
      {{paper-form-field object=object
                         originPath="number"
                         propertyPath="numberValue"
                         updated=(action 'update')}}`);

    let $component = this.element.querySelector('.form-field');
    assert.ok($component.classList.contains('form-field--changed'));
  });

  test(`Gets class 'different' when values are different`, async function(assert) {
    this.set('object', EmberObject.create({
      numberValueIsDifferent: true
    }));

    await render(hbs`{{paper-form-field object=object
                                        propertyPath="numberValue"
                                        updated=(action 'update')}}`);

    let $component = this.element.querySelector('.form-field');
    assert.ok($component.classList.contains('form-field--different'));

    run(() => this.set('object.numberValueIsDifferent', false));

    assert.ok(!$component.classList.contains('form-field--different'));
  });

  test(`Shows a component depending on the given type`, async function(assert) {
    this.set('object', EmberObject.create({
      name: 'John White'
    }));

    await render(hbs`
      {{paper-form-field type="text-field"
                         object=object
                         propertyPath="name"
                         updated=(action 'update')}}`);

    let $input = this.element.querySelector('input.md-input');
    assert.ok($input, 'shows the component depending on given type');

    let inputText = $input.value;
    assert.equal(inputText, 'John White', 'shown component has correct value');
  });

  test(`passes the name to the form field`, async function(assert) {
    this.set('object', EmberObject.create({
      name: 'John White'
    }));

    await render(hbs`
      {{paper-form-field type="text-field"
                         object=object
                         propertyPath="name"
                         name="person-name"
                         updated=(action 'update')}}`);

    let $input = this.element.querySelector('input.md-input');
    assert.equal($input.name, 'person-name', 'passes name to component');
  });

  test(`The component doesn't update the value, but calls an action`,
  async function(assert) {
    assert.expect(5);

    let person = EmberObject.create({
      name: 'John White'
    });

    this.set('object', person);

    this.actions.update = function(object, propertyPath, value) {
      assert.equal(object, person, 'update function gets right object');
      assert.equal(propertyPath, 'name', 'update function gets right propertyPath');
      assert.equal(value, 'John Black', 'update function gets new value');
    };

    await render(hbs`
      {{paper-form-field type="text-field"
                         object=object
                         propertyPath="name"
                         updated=(action "update")}}`);

    let $input = this.element.querySelector('input.md-input');

    await fillIn($input, 'John Black');

    assert.equal($input.value, 'John Black', 'changes the input value');
    assert.equal(this.get('object.name'), 'John White',
                 `doesn't update object value`);
  });

   test(`Shows a after content depending on the given content`, async function(assert) {
    this.set('object', EmberObject.create({
      text: 'voorbeeld'
    }));

    await render(hbs`
      {{paper-form-field type="text-field"
                         object=object
                         after="after tekst"
                         propertyPath="text"
                         updated=(action 'update')}}`);

    let $input = this.element.querySelector('input.md-input').value;
    assert.equal($input, 'voorbeeld', 'shown component has correct value');

    let $component = this.element.querySelector('.form-field--has-after');
    assert.ok($component.classList.contains('form-field--has-after'));

    let $afterContent = this.element.querySelector('.form-field__after').textContent;
    assert.equal($afterContent, 'after tekst', 'shows after content');
  });

  test(`passes the name to the form field`, async function(assert) {
    this.set('object', EmberObject.create({
      name: 'John White'
    }));

    await render(hbs`
      {{paper-form-field type="text-field"
                         object=object
                         propertyPath="name"
                         name="person-name"
                         updated=(action 'update')}}`);

    let $input = this.element.querySelector('input.md-input');
    assert.equal($input.name, 'person-name', 'passes name to component');
  });
});
