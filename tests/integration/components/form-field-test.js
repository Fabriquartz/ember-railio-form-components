import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('form-field', 'Integration | Component | {{form-field}}', {
  integration: true
});

test('Renders a div with class \'form-field\'', function(assert) {
  this.render(hbs `{{form-field}}`);

  const $component = this.$('div.form-field');
  assert.equal($component.length, 1);
});

test('By default shows propertyPath as label', function(assert) {
  this.render(hbs `{{form-field propertyPath="number"}}`);

  const $labels = this.$('.form-field').find('label');

  assert.equal($labels.length, 1, 'shows a label');

  const labelText = $labels.text();
  assert.equal(labelText, 'Number', 'label is same as propertyPath');
});

test('Splices label on camelcase', function(assert) {
  this.render(hbs `{{form-field propertyPath="numberValue"}}`);

  const labelText  = this.$('.form-field').find('label').text();

  assert.equal(labelText, 'Number value');
});

test('Shows no label when label=false', function(assert) {
  this.render(hbs `{{form-field label=false}}`);

  const $labels = this.$('.form-field').find('label');

  assert.equal($labels.length, 0);
});

test('Shows given String as label', function(assert) {
  this.render(hbs `{{form-field label="Object nr."}}`);

  const labelText  = this.$('.form-field').find('label').text();

  assert.equal(labelText, 'Object nr.');
});

test(`Gets class 'invalid' when object.errors.propertyPath has errors`, function(assert) {
  this.set('object', Ember.Object.create({
    errors: Ember.Object.create({
      numberValue: ['first error message']
    })
  }));

  this.render(hbs`{{form-field object=object propertyPath="numberValue"}}`);

  const $component = this.$('.form-field');

  assert.ok($component.hasClass('form-field--invalid'));

  run(() => this.set('object.errors.numberValue', null));

  assert.ok(!$component.hasClass('form-field--invalid'));
});

test(`Gets class 'changed' when value is unsaved`, function(assert) {
  this.set('object', Ember.Object.create({
    numberValueIsChanged: true
  }));

  this.render(hbs`{{form-field object=object propertyPath="numberValue"}}`);

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
    {{form-field object=object originPath="number" propertyPath="numberValue"}}
  `);

  const $component = this.$('.form-field');
  assert.ok($component.hasClass('form-field--changed'));
});

test(`Gets class 'different' when values are different`, function(assert) {
  this.set('object', Ember.Object.create({
    numberValueIsDifferent: true
  }));

  this.render(hbs`{{form-field object=object propertyPath="numberValue"}}`);

  const $component = this.$('.form-field');
  assert.ok($component.hasClass('form-field--different'));

  run(() => this.set('object.numberValueIsDifferent', false));

  assert.ok(!$component.hasClass('form-field--different'));
});
