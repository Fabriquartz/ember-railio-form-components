import Component        from 'ember-component';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';
import { computed, get, set } from '@ember/object';

export default Component.extend(formFieldOptions, {
  lazy: false,

  focusIn() {
    set(this, 'isFocused', true);
  },

  focusOut() {
    let value = this.format(get(this, '_value'));

    set(this, 'isFocused', false);
    set(this, '_value', value);
    this.send('changed', value);

    this._super(...arguments);
  },

  keyUp(e) {
    if (e.key === 'Enter')  { typeof this.enter  === 'function' && this.enter(); }
    if (e.key === 'Escape') { typeof this.escape === 'function' && this.escape(); }
  },

  didReceiveAttrs() {
    let value = get(this, 'value');
    set(this, '_value', this.format(value));
    this._super(...arguments);
  },

  format(value) {
    return value;
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
    changed(value) {
      set(this, '_value', value);

      if (!get(this, 'lazy') || !get(this, 'isFocused')) {
        this.updated(value);
      }
    },

    changedWetherLazyOrNot(value) {
      this.updated(value);
    }
  }
});
