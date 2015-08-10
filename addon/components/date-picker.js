import Ember from 'ember';
import LazyInput from '../components/lazy-input';

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

export default LazyInput.extend({
  classNames:        ['date-picker'],
  classNameBindings: ['isValid::invalid'],

  attributeBindings: [
    'formattedValue:value',
    'formattedValue:title'
  ],

  formattedValue: computed('value', {
    get() {
      const value = this.get('value');

      if (!(value && value.getDate && value.getMonth && value.getFullYear)) {
        return null;
      }

      const days   = `0${value.getDate()}`.slice(-2);
      const months = `0${value.getMonth() + 1}`.slice(-2);
      const years  = value.getFullYear().toString().slice(-2);

      return `${days}-${months}-${years}`;
    },

    set(key, value) {
      let date = this.get('value');

      if (value == null || value === '') {
        this.set('value', null);
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

      this.set('value', date);

      return value;
    }
  }),

  keyDown(e) {
    const value = this.get('value');

    if (e.keyCode === 38) {
      if (e.shiftKey) {
        this.set('value', new Date(value.setMonth(value.getMonth() + 1)));
      } else {
        this.set('value', new Date(+value + A_DAY));
      }
    }

    if (e.keyCode === 40) {
      if (e.shiftKey) {
        this.set('value', new Date(value.setMonth(value.getMonth() - 1)));
      } else {
        this.set('value', new Date(+value - A_DAY));
      }
    }

    if (e.keyCode === 38 || e.keyCode === 40) {
      this.update();
    }
  },

  // Overrides Ember.TextSupport#_elementValueDidChange
  _elementValueDidChange() {
    set(this, 'formattedValue', this.readDOMAttr('value'));
  }
});
