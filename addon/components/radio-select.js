import Component        from 'ember-component';
import invokeAction     from 'ember-invoke-action';
import computed         from 'ember-computed';
import get              from 'ember-metal/get';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  classNames:        ['radio-select'],
  classNameBindings: ['inline:radio-select--inline'],
  attributeBindings: ['title'],

  showIcon: true,
  inline:   false,

  defaultEmpty: 'No option selected',

  title: computed('cycle', 'value', 'options.@each.{code,label}', function() {
    if (get(this, 'cycle')) {
      let next            = this._getNextOption();
      let optionLabelPath = get(this, 'optionLabelPath');

      if (optionLabelPath) {
        next = get(next, optionLabelPath);
      }

      return `Click to change value to ${next}`;
    }
  }),

  _getNextOption() {
    let value           = get(this, 'value');
    let options         = get(this, 'options');
    let optionValuePath = get(this, 'optionValuePath');

    if (optionValuePath) {
      options = options.map((option) => {
        return get(option, optionValuePath);
      });
    }

    let newIndex = options.indexOf(value) + 1;
    let newValue = null;

    if (newIndex < options.length) {
      newValue = options[newIndex];
    } else {
      newValue = options[0];
    }

    return newValue;
  },

  actions: {
    selectItem(value) {
      let cycle = get(this, 'cycle');

      if (cycle) {
        value = this._getNextOption();
      }

      invokeAction(this, 'updated', value);
    }
  }
});
