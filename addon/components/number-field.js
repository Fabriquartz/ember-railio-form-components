import Ember from 'ember';
import LazyTextField from 'ember-railio-form-components/components/lazy-text-field';
import { toNumber, formatNumber } from 'ember-railio-formatting';

const { computed } = Ember;

function sliceDecimals(value, decimals) {
  return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export default LazyTextField.extend({
  classNames: ['number-field'],

  maxDecimals: null,

  minValue: -Infinity,
  maxValue:  Infinity,

  propertyTarget: 'numberValue',

  value: computed('numberValue', {
    get() {
      const value = this.get('numberValue');
      return this._formatValue(value);
    },

    set(key, value) {
      let numberValue = value;

      try {
        numberValue = toNumber(value);

        const maxDecimals = this.get('maxDecimals');
        if (maxDecimals != null) {
          numberValue = sliceDecimals(numberValue, this.get('maxDecimals'));
        }

        let minValue = this.get('minValue');
        let maxValue = this.get('maxValue');

        if (numberValue < minValue) { numberValue = minValue; }
        if (numberValue > maxValue) { numberValue = maxValue; }
      } catch (_) {}

      if (isNaN(numberValue)) {
        numberValue = null;
      }

      this.set('numberValue', numberValue);

      return this._formatValue(numberValue);
    }
  }),

  _formatValue(value) {
    return formatNumber(value, {
      decimals: this.get('maxDecimals')
    });
  },

  keyDown(e) {
    const value = this.get('numberValue');

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          this.set('numberValue', value + 1);
        }

        if (e.keyCode === 40) {
          this.set('numberValue', value - 1);
        }
      });
    }

    this._super(...arguments);
  }
});
