import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('radio-select', 'Integration | Component | {{radio-select}}', {
  integration: true
});

test('shows options', function(assert) {
  this.set('options', ['Option 1', 'Option 2']);
  this.set('selection', null);

  this.render(hbs`{{radio-select value=selection options=options}}`);

  const $options = this.$('.radio-select__option');

  assert.equal($options.length, 2, 'shows all options');
  assert.equal($options[0].innerText.trim(), 'Option 1', 'shows option 1 value');
  assert.equal($options[1].innerText.trim(), 'Option 2', 'shows option 2 value');
});

test('value selected', function(assert) {
  const selectValue =  'Option 2';
  this.set('options', ['Option 1', selectValue]);
  this.set('selection', selectValue);

  this.render(hbs`{{radio-select value=selection options=options}}`);

  const $selectedOption = this.$('.radio-select__option--selected');
  assert.equal($selectedOption.length, 1);
  assert.equal($selectedOption[0].innerText.trim(), 'Option 2');
});

test('select value calls updated action', function(assert) {
  assert.expect(1);

  const selectValue =  'Option 2';
  this.set('options', ['Option 1', selectValue, 'Option 3']);
  this.set('selection', null);

  this.on('updated', function(value) {
    assert.equal(value, selectValue, 'calls update action with clicked value');
  });

  this.render(hbs`{{radio-select value=selection
                                 options=options
                                 updated=(action 'updated')}}`);

  const $option = this.$('.radio-select__option:eq(1)');
  $option.trigger('click');
});

test('shows optionLabel and selects optionValue', function(assert) {
  assert.expect(2);
  const firstValue = { label: 'Option 1', value: 'Value 1' };
  const secondValue = { label: 'Option 2', value: 'Value 2' };

  this.set('options', [firstValue, secondValue]);
  this.set('selection', null);

  this.on('updated', function(value) {
    assert.equal(value, 'Value 2', 'calls update action with clicked value');
  });

  this.render(hbs`{{radio-select value=selection
                                 options=options
                                 optionLabelPath="label"
                                 optionValuePath="value"
                                 updated=(action "updated")}}`);

  const $option = this.$('.radio-select__option:eq(1)');
  assert.equal($option[0].innerText.trim(), 'Option 2', 'shows option 2 label');
  $option.trigger('click');
});

test('works with form-field wrapper', function(assert) {
  assert.expect(6);

  const firstValue = 'Option 1';
  const secondValue =  'Option 2';
  this.set('options', [firstValue, secondValue, 'Option 3']);
  this.set('object', Ember.Object.create({ selection: firstValue }));

  this.on('update', function(object, propertyPath, value) {
    assert.equal(value, secondValue, 'calls update action with clicekd value');
    object.set(propertyPath, value);
  });

  this.render(hbs`
    {{#form-field object=object
                  propertyPath="selection"
                  updated=(action "update")
                  disabled=disabled
                  as |value updated disabled|}}
      {{radio-select options=options
                     value=value
                     updated=updated}}
    {{/form-field}}`);

  const $options = this.$('.radio-select__option');

  assert.equal($options.length, 3);
  assert.equal($options[0].innerText.trim(), 'Option 1', 'shows option 1 value');

  const $selectedOptions = this.$('.radio-select__option--selected');
  assert.equal($selectedOptions.length, 1);
  assert.equal($selectedOptions[0].innerText.trim(), 'Option 1');

  const $option = this.$('.radio-select__option:eq(1)');
  $option.trigger('click');

  assert.equal(this.get('object.selection'), 'Option 2', 'selected option set');
});
