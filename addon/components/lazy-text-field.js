import Ember from 'ember';
import TextField from 'ember-railio-form-components/components/text-field';

const { computed, run } = Ember;

export default TextField.extend({
  attributeBindings: ['_lazyValue:value'],

  _lazyValue: computed('_value', 'lostFocus', function () {
    if (!this.isFocused) {
      return this._value;
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
    let originalFocus = this.isFocused;
    this.set('isFocused', false);

    callback.call(this);

    run.next(() => this.set('isFocused', originalFocus));
  },

  actions: {
    changed() {
      if (!this.isFocused) {
        this._super(...arguments);
      }
    },
  },
});
