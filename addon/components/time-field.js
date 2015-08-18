import Ember from 'ember';
import LazyTextField from '../components/lazy-text-field';

const { computed } = Ember;

const A_MINUTE = 1000 * 60;
const AN_HOUR  = A_MINUTE * 60;

export default LazyTextField.extend({
  classNames:        ['time-field'],
  classNameBindings: ['isValid::invalid'],

  propertyTarget: 'datetime',

  value: computed('datetime', {
    get() {
      const value = this.get('datetime');

      if (!(value && value.getHours && value.getMinutes)) {
        return null;
      }

      return this._formatTime(value);
    },

    set(key, value) {
      let date = this.get('datetime');

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

      this.set('datetime', date);

      return this._formatTime(date);
    }
  }),

  _formatTime(value) {
    const hours   = value.getHours();
    const minutes = `0${value.getMinutes()}`.slice(-2);

    return `${hours}:${minutes}`;
  },

  keyDown(e) {
    const value = this.get('datetime');

    const shift = e.shiftKey ? A_MINUTE : AN_HOUR;

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          this.set('datetime', new Date(+value + shift));
        }

        if (e.keyCode === 40) {
          this.set('datetime', new Date(+value - shift));
        }
      });
    }

    this._super(...arguments);
  }
});
