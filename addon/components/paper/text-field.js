import Component     from '@ember/component';
import { isPresent } from '@ember/utils';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';
import { computed, get, set } from '@ember/object';

export default Component.extend(formFieldOptions, {
  lazy: false,

  focusOut(e) {
    let value = this._format(get(this, '_value'));
    this.send('changed', value, e);
  },

  keyUp(e) {
    if (e.key === 'Enter')  { typeof this.enter  === 'function' && this.enter(e); }
    if (e.key === 'Escape') { typeof this.escape === 'function' && this.escape(e); }
  },

  didReceiveAttrs() {
    let value = get(this, 'value');
    set(this, '_value', this._format(value));

    this._super(...arguments);
  },

  _format: computed('format', function() {
    return typeof this.format === 'function' ? this.format : (value) => value;
  }),

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

      if (!lazy || (event && event.type === 'focusout')) {
        this._update(value);
      }
    }
  }
});
