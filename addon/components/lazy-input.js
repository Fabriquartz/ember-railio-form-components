import Ember from 'ember';
import TextField from './text-field';

const { computed } = Ember;

export default TextField.extend({
  classNameBindings: ['isValid::invalid'],
  isValid: true,

  value: computed('_value', 'isFocused', {
    get() {
      return this.get('_value');
    },

    set(key, value) {
      const isFocused = this.get('isFocused');

      this.set('_lazyValue', value);

      if (!isFocused) {
        this.set('_value', value);
      }

      return this.get('_value');
    }
  }),

  focusIn() {
    this.set('isFocused', true);
    this.$().select();
  },

  focusOut() {
    this.set('isFocused', false);
    this.update();
  },

  insertNewline() {
    this.update();
  },

  update() {
    this.set('_value', this.get('_lazyValue'));
  }
});
