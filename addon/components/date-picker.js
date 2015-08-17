import Ember from 'ember';
import LazyTextField from '../components/lazy-text-field';

const { computed } = Ember;
const set = Ember.set;

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
  classNameBindings: ['isValid::invalid'],

  propertyTarget: 'date',

  value: computed('date', {
    get() {
      const value = this.get('date');

      if (!(value && value.getDate && value.getMonth && value.getFullYear)) {
        return null;
      }

      return this._formatDate(value);
    },

    set(key, value) {
      let date = this.get('date');

      if (value == null || value === '') {
        this.set('date', null);
        return '';
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

      this.set('date', date);

      return this._formatDate(date);
    }
  }),

  keyDown(e) {
    const value = this.get('date');

    if (e.keyCode === 38 || e.keyCode === 40) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          if (e.shiftKey) {
            this.set('date', new Date(value.setMonth(value.getMonth() + 1)));
          } else {
            this.set('date', new Date(+value + A_DAY));
          }
        }

        if (e.keyCode === 40) {
          if (e.shiftKey) {
            this.set('date', new Date(value.setMonth(value.getMonth() - 1)));
          } else {
            this.set('date', new Date(+value - A_DAY));
          }
        }
      });
    }
  },

  _formatDate(date) {
    const days   = `0${date.getDate()}`.slice(-2);
    const months = `0${date.getMonth() + 1}`.slice(-2);
    const years  = date.getFullYear().toString().slice(-2);

    return `${days}-${months}-${years}`;
  },

  // Overrides Ember.TextSupport#_elementValueDidChange
  _elementValueDidChange() {
    set(this, 'formattedValue', this.readDOMAttr('value'));
  }
});
