import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import EmberObject from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import set from 'ember-metal/set';

module('Integration | Component | {{radio-select}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('shows options', async function(assert) {
    this.set('options', ['Option 1', 'Option 2']);
    this.set('selection', null);

    await render(hbs`{{radio-select value=selection options=options}}`);

    let $options = this.$('.radio-select__option');

    assert.equal($options.length, 2, 'shows all options');
    assert.equal($options[0].textContent.trim(), 'Option 1', 'shows option 1 value');
    assert.equal($options[1].textContent.trim(), 'Option 2', 'shows option 2 value');
  });

  test('value selected', async function(assert) {
    let selectValue =  'Option 2';
    this.set('options', ['Option 1', selectValue]);
    this.set('selection', selectValue);

    await render(hbs`{{radio-select value=selection options=options}}`);

    let $selectedOption = this.$('.radio-select__option--selected');
    assert.equal($selectedOption.length, 1);
    assert.equal($selectedOption[0].textContent.trim(), 'Option 2');
  });

  test('select value calls updated action', async function(assert) {
    assert.expect(1);

    let selectValue =  'Option 2';
    this.set('options', ['Option 1', selectValue, 'Option 3']);
    this.set('selection', null);

    this.actions.updated = function(value) {
      assert.equal(value, selectValue, 'calls update action with clicked value');
    };

    await render(hbs`{{radio-select value=selection
                                   options=options
                                   updated=(action 'updated')}}`);

    let $option = this.$('.radio-select__option:eq(1)');
    $option.trigger('click');
  });

  test('shows optionLabel and selects optionValue', async function(assert) {
    assert.expect(2);
    let firstValue = { label: 'Option 1', value: 'Value 1' };
    let secondValue = { label: 'Option 2', value: 'Value 2' };

    this.set('options', [firstValue, secondValue]);
    this.set('selection', null);

    this.actions.updated = function(value) {
      assert.equal(value, 'Value 2', 'calls update action with clicked value');
    };

    await render(hbs`{{radio-select value=selection
                                   options=options
                                   optionLabelPath="label"
                                   optionValuePath="value"
                                   updated=(action "updated")}}`);

    let $option = this.$('.radio-select__option:eq(1)');
    assert.equal($option[0].textContent.trim(), 'Option 2', 'shows option 2 label');
    $option.trigger('click');
  });

  test('works with form-field wrapper', async function(assert) {
    assert.expect(6);

    let firstValue = 'Option 1';
    let secondValue =  'Option 2';
    this.set('options', [firstValue, secondValue, 'Option 3']);
    this.set('object', EmberObject.create({ selection: firstValue }));

    this.actions.update = function(object, propertyPath, value) {
      assert.equal(value, secondValue, 'calls update action with clicekd value');
      object.set(propertyPath, value);
    };

    await render(hbs`
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
    assert.equal($options[0].textContent.trim(), 'Option 1', 'shows option 1 value');

    let $selectedOptions = this.$('.radio-select__option--selected');
    assert.equal($selectedOptions.length, 1);
    assert.equal($selectedOptions[0].textContent.trim(), 'Option 1');

    let $option = this.$('.radio-select__option:eq(1)');
    $option.trigger('click');

    assert.equal(this.get('object.selection'), 'Option 2', 'selected option set');
  });

  test('shows icon', async function(assert) {
    this.set('showIcon', true);
    this.set('options', ['Option 1', 'Option 2']);

    await render(hbs`{{radio-select value=selection
                                   options=options
                                   showIcon=showIcon}}`);

    let $icons = this.$('.radio-select__option .fa');
    assert.equal($icons.length, 2);

    this.set('showIcon', false);

    $icons = this.$('.radio-select__option .fa');
    assert.equal($icons.length, 0);
  });

  test('cycle true: shows only selection and changes on click',
  async function(assert) {
    set(this, 'cycle', true);

    set(this, 'options', ['Option 1', 'Option 2', 'Option 3']);

    this.actions.updated = function(value) {
      set(this, 'selection', value);
    };

    await render(hbs`{{radio-select value=selection
                                   cycle=cycle
                                   options=options
                                   updated=(action 'updated')}}`);

    let $options = this.$('.radio-select__option');
    assert.equal($options.length, 1);

    assert.equal($options.eq(0).hasClass('radio-select__option--empty'), true);
    assert.equal($options[0].textContent.trim(), 'No option selected');

    $options.eq(0).click();

    $options = this.$('.radio-select__option');
    assert.equal($options[0].textContent.trim(), 'Option 1');

    $options.eq(0).click();
    assert.equal($options[0].textContent.trim(), 'Option 2');

    $options.eq(0).click();
    assert.equal($options[0].textContent.trim(), 'Option 3');

    $options.eq(0).click();
    assert.equal($options[0].textContent.trim(), 'Option 1');
  });
});
