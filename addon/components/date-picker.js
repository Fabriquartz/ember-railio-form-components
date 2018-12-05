import LazyTextField from '../components/lazy-text-field';
import moment        from 'moment';
import { get, set }  from '@ember/object';

export default LazyTextField.extend({
  classNames: ['date-picker'],
  dateFormat: 'DD-MM-YYYY',

  didReceiveAttrs() {
    set(this, 'date', this.getAttr('value'));
    this._super(...arguments);
  },

  keyDown(e) {
    let value = moment(get(this, 'date'));
    let scale = e.shiftKey ? 'month' : 'day';

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) { // arrow up
          value = value.add(1, scale);
          return this.send('changed', value);
        }

        if (e.keyCode === 40) { // arrow down
          value = value.subtract(1, scale);
          return this.send('changed', value);
        }
      });
    }

    this._super(...arguments);
  },

  formatValue(value) {
    if (!(value && value.getDate && value.getMonth && value.getFullYear)) {
      return null;
    }

    let days   = `0${value.getDate()}`.slice(-2);
    let months = `0${value.getMonth() + 1}`.slice(-2);
    let years  = value.getFullYear().toString().slice(-2);

    return `${days}-${months}-${years}`;
  },

  actions: {
    changed(value) {
      value = value === '' ? null : value;

      if (value instanceof Date || value == null) {
        return this._super(value);
      }

      // Add a zero for shorthand: DMM => DDMM or DMMYY => DDMMYY
      if ([3, 5].includes(get(value, 'length'))) {
        value = `0${value}`;
      }

      let format  = get(this, 'dateFormat');
      let _value  = moment(get(this, 'value'));
      let hours   = _value.hours();
      let minutes = _value.minute();

      value = moment(value, format).add('hours', hours).add('minutes', minutes);
      this._super(value.toDate());
    }
  }
});