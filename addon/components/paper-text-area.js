import PaperTextField from
  'ember-railio-form-components/components/paper-text-field';
import get        from 'ember-metal/get';

function textAreaAjust(element) {
  if (element && element.scrollHeight) {
    element.style.height = '1px';
    element.style.height = `${element.scrollHeight}px`;
  }
}

export default PaperTextField.extend({
  layoutName: 'components/paper-text-field',
  classNames: ['text-area'],
  textarea:   true,

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
