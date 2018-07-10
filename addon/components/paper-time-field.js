import PaperLazyTextField from
  'ember-railio-form-components/components/paper-lazy-text-field';
import get                from 'ember-metal/get';
import set                from 'ember-metal/set';

const A_MINUTE = 1000 * 60;
const AN_HOUR  = A_MINUTE * 60;

export default PaperLazyTextField.extend({
  classNames: ['time-field'],

  didReceiveAttrs() {
    set(this, 'datetime', this.getAttr('value'));
    this._super(...arguments);
  },

  formatValue(value) {
    if (!(value && value.getHours && value.getMinutes)) {
      return null;
    }

    let hours   = value.getHours();
    let minutes = `0${value.getMinutes()}`.slice(-2);

    return `${hours}:${minutes}`;
  },

  keyDown(e) {
    let value = get(this, 'datetime');

    let shift = e.shiftKey ? A_MINUTE : AN_HOUR;

    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.withLazyDisabled(() => {
        if (e.keyCode === 38) {
          this.send('changed', new Date(+value + shift));
        }

        if (e.keyCode === 40) {
          this.send('changed', new Date(+value - shift));
        }
      });
    }

    this._super(...arguments);
  },

  actions: {
    changed(value) {
      if (value instanceof Date) {
        return this._super(value);
      }

      let date = get(this, 'datetime');

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
      this._super(date);
    }
  }
});
