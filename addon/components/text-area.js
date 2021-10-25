import Component from '@ember/component';
import textInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

import { get } from '@ember/object';

function textAreaAjust(element) {
  if (element && element.scrollHeight) {
    element.style.height = '1px';
    element.style.height = `${element.scrollHeight}px`;
  }
}

export default Component.extend(textInputMixin, formFieldOptions, {
  tagName: 'textarea',
  classNames: ['text-area'],
  attributeBindings: ['disabled', 'cols', 'rows'],

  sizeOnInput: false,

  didRender() {
    this._super(...arguments);
    this.resizeElement();
  },

  resizeElement() {
    if (this.sizeOnInput) {
      textAreaAjust(this.element);
    }

    this.element;
  },

  actions: {
    changed(value, e) {
      this.resizeElement();

      this._super(value, e);
    },
  },
});
