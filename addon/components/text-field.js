import Ember from 'ember';

function handleChanged() {
  this.send('changed', this.readDOMAttr('value'));
}

export default Ember.Component.extend({
  tagName: 'input',
  classNames: ['text-field'],
  attributeBindings: ['_value:value'],

  input:    handleChanged,
  change:   handleChanged,
  focusOut: handleChanged,

  didReceiveAttrs: function() {
    let value = this.getAttr('value');
    if (typeof this.formatValue === 'function') {
      value = this.formatValue(value);
    }
    this.set('_value', value);
  },

  actions: {
    changed(value) {
      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(value);
      }
    }
  }
});
