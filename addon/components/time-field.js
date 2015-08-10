import Ember from 'ember';
import LazyInput from '../components/lazy-input';

const { computed } = Ember;

const set = Ember.set;

const A_MINUTE = 1000 * 60;
const AN_HOUR  = A_MINUTE * 60;

export default LazyInput.extend({
  classNames:        ['time-field'],
  classNameBindings: ['isValid::invalid'],

  attributeBindings: [
    'formattedValue:value',
    'formattedValue:title'
  ],

  formattedValue: computed('value', {
    get() {
      const value = this.get('value');

      if (!(value && value.getHours && value.getMinutes)) {
        return null;
      }

      const hours   = value.getHours();
      const minutes = `0${value.getMinutes()}`.slice(-2);

      return `${hours}:${minutes}`;
    },

    set(key, value) {
      let date = this.get('value');

      if (date == null && (value == null || value === '')) {
        return '';
      }

      if (date == null) {
        date = new Date();
      } else {
        date = new Date(date);
      }

      if (value === '' || value == null) {
        date.setHours(0);
        date.setMinutes(0);
        value = '';
      } else {
        let parsed = value.replace(/[;,.]/g, ':');

        if (parsed.indexOf(':') === -1) {
          if (parsed.length >= 3) {
            // 900 -> 9:00, 1200 -> 12:00
            parsed = `${value.slice(0, -2)}:${value.slice(-2)}`;
          } else {
            // 5 -> 5:00, 12 -> 12:00
            parsed = `${value}:00`;
          }
        }

        let [hours, minutes] = parsed.split(/:/, 2);
        hours   = (+hours % 24) || 0;
        minutes = (+minutes % 60) || 0;

        date.setHours(hours);
        date.setMinutes(minutes);
      }

      this.set('value', date);

      return value;
    }
  }),

  keyDown(e) {
    const value = this.get('value');

    const shift = e.shiftKey ? A_MINUTE : AN_HOUR;

    if (e.keyCode === 38) {
      this.set('value', new Date(+value + shift));
    }

    if (e.keyCode === 40) {
      this.set('value', new Date(+value - shift));
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
