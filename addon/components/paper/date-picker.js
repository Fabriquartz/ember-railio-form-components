import moment         from 'moment';
import { get }        from '@ember/object';
import PaperTextField from
  'ember-railio-form-components/components/paper/text-field';

export default PaperTextField.extend({
  layoutName: 'components/paper/input-field',
  inputType:  'text',
  lazy:       true,
  dateFormat: 'DD-MM-YYYY',

  keyDown(e) {
    let addValue;
    let value = moment(get(this, 'value'), get(this, 'dateFormat'));
    let scale = e.shiftKey ? 'month' : 'day';

    if (e.key === 'ArrowUp')   { addValue = 1; }
    if (e.key === 'ArrowDown') { addValue = -1; }

    if (addValue) {
      e.preventDefault();
      this.send('changed', value.add(addValue, scale).toDate(), e, false);
    }

    this._super(...arguments);
  },

  format(value) {
    return value ? moment(value).format('DD-MM-YY') : '';
  },

  formatBeforeUpdate(value) {
    value = value === '' ? null : value;

    if (value instanceof Date || value == null) {
      return value;
    }

    // Add a zero for shorthand: DMM => DDMM or DMMYY => DDMMYY
    if ([3, 5].includes(get(value, 'length'))) {
      value = `0${value}`;
    }

    let format  = get(this, 'dateFormat');
    let _value  = moment(get(this, 'value'));
    let hours   = _value.hours();
    let minutes = _value.minute();

    return moment(value, format).add('hours', hours).add('minutes', minutes);
  },

  actions: {
    changed(value, e, lazy) {
      value = value === '' ? null : value;

      this._super(value, e, lazy);
    }
  }
});