import Ember from 'ember';

function handleChanged() {
  let value = this.readDOMAttr('value');

  if (typeof this.sanitizeValue === 'function') {
    const originalValue = value;
    const input         = this.$()[0];
    const caretPos      = input.selectionStart;

    value = this.sanitizeValue(value);

    if (originalValue !== value) {
      this.$().val(value);
      input.setSelectionRange(caretPos - 1, caretPos - 1);
    }
  }

  this.send('changed', value);
}

export default Ember.Mixin.create({
  attributeBindings: ['_value:value', 'disabled'],

  input:    handleChanged,
  change:   handleChanged,

  focusIn: function() {
    if (typeof this.attrs.focusIn === 'function') {
      this.attrs.focusIn();
    }
  },

  focusOut: function() {
    if (typeof this.attrs.focusOut === 'function') {
      this.attrs.focusOut();
    }
    handleChanged.call(this);
  },

  keyUp: function(e) {
    if (typeof this.attrs.keyUp === 'function') {
      this.attrs.keyUp();
    }
    if (e.keyCode === 13) {
      if (typeof this.attrs.enter === 'function') {
        this.attrs.enter();
      }
    }

    if (e.keyCode === 27) {
      if (typeof this.attrs.escape === 'function') {
        this.attrs.escape();
      }
    }
  },

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
