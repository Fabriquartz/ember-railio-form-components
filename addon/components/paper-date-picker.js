import PaperLazyTextField from
  'ember-railio-form-components/components/paper-lazy-text-field';
import get                from 'ember-metal/get';
import set                from 'ember-metal/set';

const A_DAY = 1000 * 60 * 60 * 24;

function today() {
  let date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export default PaperLazyTextField.extend({
  classNames: ['date-picker'],

  didReceiveAttrs() {
    set(this, 'date', this.getAttr('value'));
    this._super(...arguments);
  },

  keyDown(e) {
    let value = get(this, 'date');

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          if (e.shiftKey) {
            this.send('changed', new Date(value.setMonth(value.getMonth() + 1)));
          } else {
            this.send('changed', new Date(+value + A_DAY));
          }
        }

        if (e.keyCode === 40) {
          if (e.shiftKey) {
            this.send('changed', new Date(value.setMonth(value.getMonth() - 1)));
          } else {
            this.send('changed', new Date(+value - A_DAY));
          }
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
      if (value instanceof Date) {
        return this._super(value);
      }

      let date = get(this, 'date');

      if (value == null || value === '') {
        return this._super(null);
      }

      if (date == null) {
        date = today();
      } else {
        date = new Date(date);
      }

      let parsed = value.replace(/[;/\\,.]/g, '-');

      if (parsed.indexOf('-') === -1) {
        let year  = (new Date()).getFullYear().toString().slice(-2);
        let month = (`0${((new Date()).getMonth() + 1)}`).toString().slice(-2);

        if (parsed.length >= 5) {
          parsed =
            `${parsed.slice(0, -4)}-${parsed.slice(-4, -2)}-${parsed.slice(-2)}`;
        } else if (parsed.length >= 3) {
          parsed = `${parsed.slice(0, -2)}-${parsed.slice(-2)}-${year}`;
        } else {
          parsed = `${parsed.slice(-2)}-${month}-${year}`;
        }
      }

      let [days, months, years] = parsed.split('-');
      years  = 2000 + (+years);
      months = (+months) - 1;
      days   = (+days);

      date.setFullYear(years);
      date.setMonth(months);
      date.setDate(days);

      this._super(date);
    }
  }
});