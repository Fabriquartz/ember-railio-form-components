import Component        from 'ember-component';
import textInputMixin   from 'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options'; //eslint-disable-line

import get from 'ember-metal/get';

function textAreaAjust(element) {
  if (element && element.scrollHeight) {
    element.style.height = '1px';
    element.style.height = `${element.scrollHeight}px`;
  }
}

export default Component.extend(textInputMixin, formFieldOptions, {
  tagName:           'textarea',
  classNames:        ['text-area'],
  attributeBindings: ['disabled', 'cols', 'rows'],

  sizeOnInput: false,

  didRender() {
    this.resizeElement();
  },

  resizeElement() {
    if (get(this, 'sizeOnInput')) {
      textAreaAjust(get(this, 'element'));
    }

    get(this, 'element');
  },

  actions: {
    changed(value) {
      this.resizeElement();

      this._super(value);
    }
  }
});
