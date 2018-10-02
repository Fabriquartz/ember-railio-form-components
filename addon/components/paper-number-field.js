import { get, set } from '@ember/object';

import PaperLazyTextField from
  'ember-railio-form-components/components/paper-lazy-text-field';
import { toNumber, formatNumber } from 'ember-railio-formatting';

function sliceDecimals(value, decimals) {
  return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function increaseNumber(value, add) {
  value = toNumber(value);
  if (value == null || isNaN(value)) {
    value = 0;
  }

  let stringValue = value.toString();
  let decimalIndex = stringValue.indexOf('.');
  let decimalsAmount = 0;

  if (decimalIndex !== -1) {
    decimalsAmount = stringValue.slice(decimalIndex + 1).length;
  }

  let increasedValue = value + add;

  return parseFloat(increasedValue.toFixed(decimalsAmount));
}

export default PaperLazyTextField.extend({
  layoutName: 'components/paper-text-field',

  didReceiveAttrs() {
    set(this, 'numberValue', this.getAttr('value'));
    this._super(...arguments);
  },

  sanitizeValue(value) {
    return value.replace(/[^0-9,.\- ]+/g, '');
  },

  formatValue(value) {
    return formatNumber(value, { decimals: this.get('maxDecimals') });
  },

  keyDown(e) {
    let _value = get(this, '_value');

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.$().trigger('input');
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          this.send('changed', increaseNumber(_value, 1));
        }

        if (e.keyCode === 40) {
          this.send('changed', increaseNumber(_value, -1));
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

        let maxDecimals = get(this, 'maxDecimals');
        if (maxDecimals != null) {
          numberValue = sliceDecimals(numberValue, get(this, 'maxDecimals'));
        }
      } catch(_) {
        // continue regardless of error
      }

      if (isNaN(numberValue)) {
        numberValue = null;
      }

      this._super(numberValue);
    }
  }
});
