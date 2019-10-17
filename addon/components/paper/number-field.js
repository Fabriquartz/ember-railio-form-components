import { get }     from '@ember/object';
import { isBlank } from '@ember/utils';

import PaperTextField from
  'ember-railio-form-components/components/paper/text-field';

import { toNumber, formatNumber } from 'ember-railio-formatting';

function increaseNumber(value, add) {
  value = toNumber(value);
  return isBlank(value) ? 0 : value + add;
}

export default class PaperNumberField extends PaperTextField {
  inputType = 'text';
  decimals = null;
  lazy = true;

  keyDown(e) {
    let addValue;
    let value = get(this, 'value') || 0;

    if (e.key === 'ArrowUp')   { addValue = 1; }
    if (e.key === 'ArrowDown') { addValue = -1; }

    if (addValue) {
      e.preventDefault();
      let decimalIndex   = value.toString().indexOf('.');
      let decimalsAmount = 0;

      if (decimalIndex !== -1) {
        decimalsAmount = value.toString().slice(decimalIndex).length;
      }

      value = increaseNumber(value, addValue).toFixed(decimalsAmount);
      this.send('changed', toNumber(value), e, true);
    }
  }

  format(value) {
    let decimals = get(this, 'decimals');
    return formatNumber(value, { decimals });
  }

  serialize(value) {
    return toNumber(value);
  }
}
