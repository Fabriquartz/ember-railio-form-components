import Component from '@ember/component';
import { computed } from '@ember/object';

import { proxyIsEqual as isEqual } from 'ember-proxy-util';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';
import layout from 'ember-railio-form-components/templates/components/railio-radio-button';

export default Component.extend(formFieldOptions, {
  layout,

  classNames: ['radio-select__option'],
  classNameBindings: [
    'checked:radio-select__option--selected',
    'icon::no-icon',
  ],

  icon: computed('showIcon', 'inline', function () {
    if (this.inline) {
      return false;
    }
    return this.showIcon;
  }),

  checked: computed('option', 'selection', 'optionValuePath', function () {
    let optionValuePath = this.optionValuePath;

    if (optionValuePath) {
      return this.get(`option.${optionValuePath}`) === this.selection;
    }

    return isEqual(this.option, this.selection);
  }),

  label: computed('option', 'optionLabelPath', function () {
    let optionLabelPath = this.optionLabelPath;

    if (optionLabelPath) {
      return this.get(`option.${optionLabelPath}`);
    }
    return this.option;
  }),

  click() {
    let optionValuePath = this.optionValuePath;
    let value = this.option;

    if (optionValuePath) {
      value = this.get(`option.${optionValuePath}`);
    }

    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(value);
    }
  },
});
