import { get }     from '@ember/object';
import { isBlank } from '@ember/utils';

import PaperTextField from
  'ember-railio-form-components/components/paper/text-field';
import { toNumber, formatNumber } from 'ember-railio-formatting';

function increaseNumber(value, add) {
  value = toNumber(value);
  return isBlank(value) ? 0 : value + add;
}

export default PaperTextField.extend({
  decimals: 2,
  lazy:     true,

  keyDown(e) {
    let addValue;
    let value = get(this, '_value') || 0;

    if (e.key === 'ArrowUp')   { addValue = 1; }
    if (e.key === 'ArrowDown') { addValue = -1; }

    if (addValue) {
      e.preventDefault();
      this.send('changed', increaseNumber(value, addValue), e, false);
    }
  },

  format(value) {
    let decimals = get(this, 'decimals');
    return formatNumber(value, { decimals });
  }
});
