import LazyTextField from 'ember-railio-form-components/components/lazy-text-field';
import { toNumber, formatNumber } from 'ember-railio-formatting';

function sliceDecimals(value, decimals) {
  return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function increaseNumber(value, add) {
  if (value == null || typeof value !== 'number') {
    value = 0;
  }

  const stringValue = value.toString();
  const decimalIndex = stringValue.indexOf('.');
  let decimalsAmount = 0;

  if (decimalIndex !== -1) {
    decimalsAmount = stringValue.slice(decimalIndex + 1).length;
  }

  const increasedValue = value + add;

  return parseFloat(increasedValue.toFixed(decimalsAmount));
}

export default LazyTextField.extend({
  classNames: ['number-field'],

  maxDecimals: null,

  didReceiveAttrs: function() {
    this.set('numberValue', this.getAttr('value'));
    this._super(...arguments);
  },

  formatValue(value) {
    return formatNumber(value, { decimals: this.get('maxDecimals') });
  },

  keyDown(e) {
    const value = this.get('numberValue');

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          this.send('changed', increaseNumber(value, 1));
        }

        if (e.keyCode === 40) {
          this.send('changed', increaseNumber(value, -1));
        }
      });
    }

    this._super(...arguments);
  },

  actions: {
    changed(value) {
      let numberValue;

      try {
        numberValue = toNumber(value);

        const maxDecimals = this.get('maxDecimals');
        if (maxDecimals != null) {
          numberValue = sliceDecimals(numberValue, this.get('maxDecimals'));
        }
      } catch (_) {}

      if (isNaN(numberValue)) {
        numberValue = null;
      }

      this._super(numberValue);
    }
  }
});
