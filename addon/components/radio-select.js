import Component from '@ember/component';
import invokeAction from 'ember-invoke-action';
import { computed } from '@ember/object';
import { get } from '@ember/object';

import layout from '../templates/components/radio-select';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  layout,
  classNames: ['radio-select'],
  classNameBindings: ['inline:radio-select--inline'],
  attributeBindings: ['title'],

  showIcon: true,
  inline: false,

  defaultEmpty: 'No option selected',

  title: computed('cycle', 'optionLabelPath', 'options', 'value', function () {
    if (this.cycle) {
      let next = this._getNextOption();
      let optionLabelPath = this.optionLabelPath;

      if (optionLabelPath) {
        next = get(next, optionLabelPath);
      }

      return `Click to change value to ${next}`;
    }
  }),

  _getNextOption() {
    let value = this.value;
    let options = this.options;
    let optionValuePath = this.optionValuePath;

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
      let cycle = this.cycle;

      if (cycle) {
        value = this._getNextOption();
      }

      invokeAction(this, 'updated', value);
    },
  },
});
