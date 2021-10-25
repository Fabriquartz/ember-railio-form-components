import Component from '@ember/component';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

import layout from 'ember-railio-form-components/templates/components/paper/input-field';

import { computed, get, set } from '@ember/object';

function isFocusOutEvent(event) {
  return event && event.type === 'focusout';
}

export default Component.extend(formFieldOptions, {
  layout,

  inputType: 'text',
  lazy: false,

  format: (value) => value,
  serialize: (value) => value,

  focusIn() {
    set(this, 'hasFocus', true);
  },

  focusOut(e) {
    set(this, 'hasFocus', false);
    this.send('changed', this._value, e);
  },

  keyUp(e) {
    if (e.key === 'Enter') {
      typeof this.enter === 'function' && this.enter(e);
    }
    if (e.key === 'Escape') {
      typeof this.escape === 'function' && this.escape(e);
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (!this.hasFocus) {
      let value = this.value;
      set(this, '_value', this.format(value));
    }
  },

  _htmlAttributes: computed('htmlAttributes', 'name', function () {
    let name = this.name;
    let htmlAttributes = this.htmlAttributes || {};

    if (!htmlAttributes.name && name) {
      htmlAttributes.name = name;
    }
    return htmlAttributes;
  }),

  actions: {
    changed(value, event, forceUpdate) {
      let lazy = this.lazy;

      let _value =
        forceUpdate || isFocusOutEvent(event) ? this.format(value) : value;

      set(this, '_value', _value);

      if (forceUpdate || !lazy || isFocusOutEvent(event)) {
        value = this.serialize(value);
        this.updated(value);
      }
    },
  },
});
