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
  layoutName: 'components/paper-text-field',

  decimals: 2,
  lazy:     true,

  keyDown(e) {
    let addValue;
    let value = get(this, '_value') || 0;

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      addValue = e.key === 'ArrowUp' ? 1 : -1;
    }

    if (addValue) {
      e.preventDefault();
      this.send('changedWetherLazyOrNot', increaseNumber(value, addValue));
    }

    this._super(...arguments);
  },

  format(value) {
    let decimals = get(this, 'decimals');
    return formatNumber(value, { decimals });
  }
});
