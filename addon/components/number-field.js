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
      this.send('errorMessageClear');
      const value = this.get('numberValue');
      return this._formatValue(value);
    },

    set(key, value) {
      this.send('errorMessageClear');
      let numberValue = value;

      try {
        numberValue = toNumber(value);

        const maxDecimals = this.get('maxDecimals');
        if (maxDecimals != null) {
          numberValue = sliceDecimals(numberValue, this.get('maxDecimals'));
        }

        let minValue = this.get('minValue');
        let maxValue = this.get('maxValue');

        if (numberValue < minValue) {
          this.send('errorMessage', `Value '${numberValue}' is invalid; minimum value is ${minValue}`);
          numberValue = minValue;
        }
        if (numberValue > maxValue) {
          this.send('errorMessage', `Value '${numberValue}' is invalid; maximum value is ${maxValue}`, 3000);
          numberValue = maxValue;
        }
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
