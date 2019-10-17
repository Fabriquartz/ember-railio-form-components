import get              from 'ember-metal/get';
import TextInput        from 'ember-railio-form-components/components/text-input';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

function textAreaAjust(element) {
  if (element && element.scrollHeight) {
    element.style.height = '1px';
    element.style.height = `${element.scrollHeight}px`;
  }
}

export default TextInput.extend(formFieldOptions, {
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
    changed(value, e) {
      this.resizeElement();

      this._super(value, e);
    }
  }
});
