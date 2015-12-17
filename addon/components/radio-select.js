import Ember from 'ember';
import invokeAction from 'ember-invoke-action';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['radio-select'],
  classNameBindings: ['inline:radio-select--inline'],
  attributeBindings: ['title'],
  showIcon: true,
  inline: false,

  defaultEmpty: 'No option selected',
  title: computed('cycle', 'value', 'options', function() {
    if (get(this, 'cycle')) {
      let next = this._getNextOption();
      const optionLabelPath = get(this, 'optionLabelPath');

      if (optionLabelPath) {
        next = get(next, optionLabelPath);
      }

      return `Click to change value to ${next}`;
    }
  }),

  _getNextOption() {
    const value = get(this, 'value');
    let options = get(this, 'options');
    const optionValuePath = get(this, 'optionValuePath');

    if (optionValuePath) {
      options = options.map((option) => {
        return get(option, optionValuePath);
      });
    }

    const newIndex = options.indexOf(value) + 1;

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
      const cycle = get(this, 'cycle');

      if (cycle) {
        value = this._getNextOption();
      }

      invokeAction(this, 'updated', value);
    }
  }
});
