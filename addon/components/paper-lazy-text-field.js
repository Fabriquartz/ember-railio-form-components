import { run }              from '@ember/runloop';
import PaperTextField       from
  'ember-railio-form-components/components/paper-text-field';
import get                  from 'ember-metal/get';
import set                  from 'ember-metal/set';

export default PaperTextField.extend({
  layoutName: 'components/paper-text-field',

  focusIn() {
    set(this, 'isFocused', true);
  },

  focusOut() {
    set(this, 'isFocused', false);
    this._super(...arguments);
  },

  withLazyDisabled(callback) {
    let originalFocus = get(this, 'isFocused');
    set(this, 'isFocused', false);

    callback.call(this);

    run.next(() => set(this, 'isFocused', originalFocus));
  },

  didReceiveAttrs() {
    if (!get(this, 'isFocused')) {
      this._super(...arguments);
    }
  },

  actions: {
    changed() {
      if (!get(this, 'isFocused')) {
        this._super(...arguments);
      }
    }
  }
});
