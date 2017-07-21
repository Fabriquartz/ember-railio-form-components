import Ember from 'ember';
import TextField from 'ember-railio-form-components/components/text-field';

const { computed, run } = Ember;

export default TextField.extend({
  attributeBindings: ['_lazyValue:value'],

  _lazyValue: computed('_value', 'lostFocus', function() {
    if (!this.get('isFocused')) {
      return this.get('_value');
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
    let originalFocus = this.get('isFocused');
    this.set('isFocused', false);

    callback.call(this);

    run.next(() => this.set('isFocused', originalFocus));
  },

  actions: {
    changed() {
      if (!this.get('isFocused')) {
        this._super(...arguments);
      }
    }
  }
});
