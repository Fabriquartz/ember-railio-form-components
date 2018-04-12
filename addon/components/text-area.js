import Component        from 'ember-component';
import textInputMixin   from 'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options'; //eslint-disable-line

import get from 'ember-metal/get';

function textAreaAjust(element) {
  element.style.height = '1px';
  element.style.height = `${element.scrollHeight}px`;
}

export default Component.extend(textInputMixin, formFieldOptions, {
  tagName:           'textarea',
  classNames:        ['text-area'],
  attributeBindings: ['disabled'],

  sizeOnInput: false,

  actions: {
    changed(value) {
      if (get(this, 'sizeOnInput')) {
        textAreaAjust(get(this, 'element'));
      }

      this._super(value);
    }
  }
});
