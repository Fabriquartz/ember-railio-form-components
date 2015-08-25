import Ember from 'ember';

function handleChanged() {
  this.send('changed', this.readDOMAttr('checked'));
}

export default Ember.Component.extend({
  tagName:           'input',
  type:              'checkbox',
  attributeBindings: ['type', 'value:checked'],
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
