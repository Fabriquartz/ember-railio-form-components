import Component     from '@ember/component';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';
import { computed, get, set } from '@ember/object';

function isFocusOutEvent(event) {
  return event && event.type === 'focusout';
}

export default Component.extend(formFieldOptions, {
  layoutName: 'components/paper/input-field',
  inputType:  'text',
  lazy:       false,

  format:    (value) => value,
  serialize: (value) => value,

  focusIn() {
    set(this, 'hasFocus', true);
  },

  focusOut(e) {
    set(this, 'hasFocus', false);
    this.send('changed', get(this, '_value'), e);
  },

  keyUp(e) {
    if (e.key === 'Enter')  { typeof this.enter  === 'function' && this.enter(e); }
    if (e.key === 'Escape') { typeof this.escape === 'function' && this.escape(e); }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (!get(this, 'hasFocus')) {
      let value = get(this, 'value');
      set(this, '_value', this.format(value));
    }
  },

  _htmlAttributes: computed('htmlAttributes', 'name', function() {
    let name           = get(this, 'name');
    let options        = get(this, 'options') || {};
    let htmlAttributes = get(options, 'htmlAttributes') || {};

    if (!htmlAttributes.name && name) {
      htmlAttributes.name = name;
    }
    return htmlAttributes;
  }),

  actions: {
    changed(value, event, forceUpdate) {
      let lazy = get(this, 'lazy');

      let _value = forceUpdate ||
        isFocusOutEvent(event) ? this.format(value) : value;

      set(this, '_value', _value);

      if (forceUpdate || !lazy || isFocusOutEvent(event)) {
        value = this.serialize(value);
        this.updated(value);
      }
    }
  }
});
