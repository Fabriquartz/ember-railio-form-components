import Component from 'ember-component';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

function handleChanged() {
  this.send('changed', this.readDOMAttr('checked'));
}

export default Component.extend(formFieldOptions, {
  tagName:           'input',
  type:              'checkbox',
  attributeBindings: ['type', 'value:checked', 'disabled'],
  classNames:        ['check-box'],

  change: handleChanged,

  actions: {
    changed(value) {
      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(value);
      }
    }
  }
});
