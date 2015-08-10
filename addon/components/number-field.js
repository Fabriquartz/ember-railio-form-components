import Ember from 'ember';
import LazyInput from 'ember-railio-form-components/components/lazy-input';
import { toNumber, formatNumber } from 'ember-railio-formatting';

const { computed } = Ember;

const set = Ember.set;

export default LazyInput.extend({
  classNames: ['number-field'],

  attributeBindings: [
    'formattedValue:value',
    'formattedValue:title'
  ],

  maxDecimals: 2,

  formattedValue: computed('value', {
    get() {
      const value = this.get('value');
      return this._formatValue(value);
    },

    set(key, value) {
      let numberValue = value;

      try { numberValue = toNumber(value); } catch (_) {}

      if (isNaN(numberValue)) {
        numberValue = null;
      }

      this.set('value', numberValue);

      return value;
    }
  }),

  keyDown(e) {
    const value = this.get('value');

    if (e.keyCode === 38) {
      this.set('value', value + 1);
    }

    if (e.keyCode === 40) {
      this.set('value', value - 1);
    }

    if (e.keyCode === 38 || e.keyCode === 40) {
      this.update();
    }
  },

  _formatValue(value) {
    return formatNumber(value, {
      decimals: this.get('maxDecimals')
    });
  },

  // Overrides Ember.TextSupport#_elementValueDidChange
  _elementValueDidChange() {
    set(this, 'formattedValue', this.readDOMAttr('value'));
  }
});
