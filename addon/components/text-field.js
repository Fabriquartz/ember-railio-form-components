import Ember from 'ember';
import PropertyPathMixin from 'ember-railio-form-components/mixins/property-path-mixin';

function handleChanged() {
  this.send('changed', this.readDOMAttr('value'));
}

export default Ember.Component.extend(PropertyPathMixin, {
  tagName: 'input',
  classNames: ['text-field'],
  classNameBindings: ['isValid::flash-invalid'],
  attributeBindings: ['value'],

  isValid: true,

  propertyTarget: 'value',

  input: function() {
    this.set('isValid', true);
    handleChanged.call(this);
  },
  change:   function() {
    this.set('isValid', true);
    handleChanged.call(this);
  },
  focusOut: handleChanged,

  actions: {
    changed(value) {
      this.set('value', value);
    },
    errorMessage(message, later) {
      this.set('isValid', false);

      if (typeof this.attrs.errorMessage === 'function') {
        this.attrs.errorMessage(message);

        if (later != null && later > 0) {
          Ember.run.later(() => {
            this.set('isValid', true);
          }, later);
        }
      }
    },
    errorMessageClear() {
      this.set('isValid', true);
    }
  }
});
