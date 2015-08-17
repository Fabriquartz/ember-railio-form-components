import Ember from 'ember';
import TextField from './text-field';

const { computed, run } = Ember;

export default TextField.extend({
  attributeBindings: ['_lazyValue:value'],

  _lazyValue: computed('value', 'isFocused', function() {
    if (!this.get('isFocused')) {
      return this.get('value');
    }
  }),

  focusIn() {
    this.set('isFocused', true);
  },

  focusOut() {
    this.set('isFocused', false);
    this._super(...arguments);
  },

  withLazyDisabled(callback) {
    const originalFocus = this.get('isFocused');
    this.set('isFocused', false);

    callback.call(this);

    run.next(() => {
      this.set('isFocused', originalFocus);
    });
  },

  actions: {
    changed() {
      if (!this.get('isFocused')) {
        this._super(...arguments);
      }
    }
  }

  // classNameBindings: ['isValid::invalid'],
  // isValid: true,
});
