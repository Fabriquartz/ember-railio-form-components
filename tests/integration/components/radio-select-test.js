import { moduleForComponent, test } from 'ember-qunit';
import EmberObject from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import set from 'ember-metal/set';

moduleForComponent('radio-select', 'Integration | Component | {{radio-select}}', {
  integration: true
});

test('shows options', function(assert) {
  this.set('options', ['Option 1', 'Option 2']);
  this.set('selection', null);

  this.render(hbs`{{radio-select value=selection options=options}}`);

  let $options = this.$('.radio-select__option');

  assert.equal($options.length, 2, 'shows all options');
  assert.equal($options[0].innerText.trim(), 'Option 1', 'shows option 1 value');
  assert.equal($options[1].innerText.trim(), 'Option 2', 'shows option 2 value');
});

test('value selected', function(assert) {
  let selectValue =  'Option 2';
  this.set('options', ['Option 1', selectValue]);
  this.set('selection', selectValue);

  this.render(hbs`{{radio-select value=selection options=options}}`);

  let $selectedOption = this.$('.radio-select__option--selected');
  assert.equal($selectedOption.length, 1);
  assert.equal($selectedOption[0].innerText.trim(), 'Option 2');
});

test('select value calls updated action', function(assert) {
  assert.expect(1);

  let selectValue =  'Option 2';
  this.set('options', ['Option 1', selectValue, 'Option 3']);
  this.set('selection', null);

  this.on('updated', function(value) {
    assert.equal(value, selectValue, 'calls update action with clicked value');
  });

  this.render(hbs`{{radio-select value=selection
                                 options=options
                                 updated=(action 'updated')}}`);

  let $option = this.$('.radio-select__option:eq(1)');
  $option.trigger('click');
});

test('shows optionLabel and selects optionValue', function(assert) {
  assert.expect(2);
  let firstValue = { label: 'Option 1', value: 'Value 1' };
  let secondValue = { label: 'Option 2', value: 'Value 2' };

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

  let $option = this.$('.radio-select__option:eq(1)');
  assert.equal($option[0].innerText.trim(), 'Option 2', 'shows option 2 label');
  $option.trigger('click');
});

test('works with form-field wrapper', function(assert) {
  assert.expect(6);

  let firstValue = 'Option 1';
  let secondValue =  'Option 2';
  this.set('options', [firstValue, secondValue, 'Option 3']);
  this.set('object', EmberObject.create({ selection: firstValue }));

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

  let $options = this.$('.radio-select__option');

  assert.equal($options.length, 3);
  assert.equal($options[0].innerText.trim(), 'Option 1', 'shows option 1 value');

  let $selectedOptions = this.$('.radio-select__option--selected');
  assert.equal($selectedOptions.length, 1);
  assert.equal($selectedOptions[0].innerText.trim(), 'Option 1');

  let $option = this.$('.radio-select__option:eq(1)');
  $option.trigger('click');

  assert.equal(this.get('object.selection'), 'Option 2', 'selected option set');
});

test('shows icon', function(assert) {
  this.set('showIcon', true);
  this.set('options', ['Option 1', 'Option 2']);

  this.render(hbs`{{radio-select value=selection
                                 options=options
                                 showIcon=showIcon}}`);

  let $icons = this.$('.radio-select__option .fa');
  assert.equal($icons.length, 2);

  this.set('showIcon', false);

  $icons = this.$('.radio-select__option .fa');
  assert.equal($icons.length, 0);
});

test('cycle true: shows only selection and changes on click', function(assert) {
  set(this, 'cycle', true);

  set(this, 'options', ['Option 1', 'Option 2', 'Option 3']);

  this.on('updated', function(value) {
    set(this, 'selection', value);
  });

  this.render(hbs`{{radio-select value=selection
                                 cycle=cycle
                                 options=options
                                 updated=(action 'updated')}}`);

  let $options = this.$('.radio-select__option');
  assert.equal($options.length, 1);

  assert.equal($options.eq(0).hasClass('radio-select__option--empty'), true);
  assert.equal($options[0].innerText.trim(), 'No option selected');

  $options.eq(0).click();

  $options = this.$('.radio-select__option');
  assert.equal($options[0].innerText.trim(), 'Option 1');

  $options.eq(0).click();
  assert.equal($options[0].innerText.trim(), 'Option 2');

  $options.eq(0).click();
  assert.equal($options[0].innerText.trim(), 'Option 3');

  $options.eq(0).click();
  assert.equal($options[0].innerText.trim(), 'Option 1');
});
