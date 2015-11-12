import LazyTextField from '../components/lazy-text-field';

const A_DAY = 1000 * 60 * 60 * 24;

function today() {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export default LazyTextField.extend({
  classNames:        ['date-picker'],
  type: 'date',

  didReceiveAttrs: function() {
    this.set('date', this.getAttr('value'));
    this._super(...arguments);
  },

  keyDown(e) {
    const value = this.get('date');

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

    const days   = `0${value.getDate()}`.slice(-2);
    const months = `0${value.getMonth() + 1}`.slice(-2);
    const years  = value.getFullYear().toString().slice(-2);

    return `${days}-${months}-${years}`;
  },

  actions: {
    changed(value) {
      if (value instanceof Date) {
        return this._super(value);
      }

      let date = this.get('date');

      if (value == null || value === '') {
        return this._super(null);
      }

      if (date == null) {
        date = today();
      } else {
        date = new Date(date);
      }

      let parsed = value.replace(/[;\/\\,.]/g, '-');

      if (parsed.indexOf('-') === -1) {
        const year  = (new Date()).getFullYear().toString().slice(-2);
        const month = ('0' + ((new Date()).getMonth() + 1)).toString().slice(-2);

        if (parsed.length >= 5) {
          parsed =
            `${parsed.slice(0, -4)}-${parsed.slice(-4, -2)}-${parsed.slice(-2)}`;
        } else if (parsed.length >= 3) {
          parsed = parsed.slice(0, -2) + '-' + parsed.slice(-2) + '-' + year;
        } else {
          parsed = parsed.slice(-2) + '-' + month + '-' + year;
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
