import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/railio-radio-button';

const { computed } = Ember;

export default Ember.Component.extend({
  layout: layout,

  classNames: ['radio-select__option'],
  classNameBindings: [
    'checked:radio-select__option--selected',
    'icon::no-icon'
  ],

  icon: computed('showIcon', 'inline', function() {
    if (this.get('inline')) {
      return false;
    }
    return this.get('showIcon');
  }),

  checked: computed('option', 'selection', function() {
    const optionValuePath = this.get('optionValuePath');

    if (optionValuePath) {
      return this.get('option.' + optionValuePath) === this.get('selection');
    }

    return Ember.isEqual(
      this.get('option'),
      this.get('selection')
    );
  }),

  label: computed('option', 'optionLabelPath', function() {
    const optionLabelPath = this.get('optionLabelPath');

    if (optionLabelPath) {
      return this.get('option.' + optionLabelPath);
    }
    return this.get('option');
  }),

  click: function() {
    const optionValuePath = this.get('optionValuePath');
    let value = this.get('option');

    if (optionValuePath) {
      value = this.get('option.' + optionValuePath);
    }

    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(value);
    }
  }
});
