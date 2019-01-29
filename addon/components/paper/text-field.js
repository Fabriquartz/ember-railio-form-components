import Component     from '@ember/component';
import { isPresent } from '@ember/utils';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';
import { computed, get, set } from '@ember/object';

export default Component.extend(formFieldOptions, {
  layoutName: 'components/paper/input-field',
  inputType:  'text',
  lazy:       false,

  focusIn() {
    set(this, 'hasFocus', true);
  },

  focusOut(e) {
    set(this, 'hasFocus', false);

    let value = get(this, '_value');
    value = typeof this.format === 'function' ? this.format(value) : value;

    this.send('changed', value, e);
  },

  keyUp(e) {
    if (e.key === 'Enter')  { typeof this.enter  === 'function' && this.enter(e); }
    if (e.key === 'Escape') { typeof this.escape === 'function' && this.escape(e); }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'hasFocus')) {
      let value = get(this, 'value');
      value = typeof this.format === 'function' ? this.format(value) : value;

      set(this, '_value', value);
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
    changed(value, event, lazy) {
      lazy = isPresent(lazy) ? lazy : get(this, 'lazy');

      set(this, '_value', value);

      if (typeof this.updated === 'function' &&
          (!lazy || (event && event.type === 'focusout'))) {

        let format = this.formatBeforeUpdate;
        value = typeof format === 'function' ? format(value) : value;
        this.updated(value);
      }
    }
  }
});
