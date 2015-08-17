import Ember from 'ember';
import PropertyPathMixin from 'ember-railio-form-components/mixins/property-path-mixin';

function handleChanged() {
  this.send('changed', this.readDOMAttr('value'));
}

export default Ember.Component.extend(PropertyPathMixin, {
  tagName: 'input',
  attributeBindings: [
    'value'
  ],

  propertyTarget: 'value',

  input:    handleChanged,
  change:   handleChanged,
  focusOut: handleChanged,

  actions: {
    changed(value) {
      this.set('value', value);
    }
  }
});
