import Component from 'ember-component';

function handleChanged() {
  this.send('changed', this.readDOMAttr('checked'));
}

export default Component.extend({
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
