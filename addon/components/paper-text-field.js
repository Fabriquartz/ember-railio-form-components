import Component        from 'ember-component';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';
import get   from 'ember-metal/get';
import set   from 'ember-metal/set';

export default Component.extend(formFieldOptions, {

  focusIn() {
    if (typeof this.attrs.focusIn === 'function') {
      this.attrs.focusIn();
    }
  },

  focusOut() {
    let _value = get(this, '_value');
    if (typeof this.attrs.focusOut === 'function') {
      this.attrs.focusOut();
    }

    if (typeof get(this, 'format') === 'function') {
      _value = this.format(_value);
      set(this, '_value', _value);
    }

    this.send('changed', _value);
  },

  keyUp(e) {
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

  didReceiveAttrs() {
    let value = this.getAttr('value');
    if (typeof this.formatValue === 'function') {
      value = this.formatValue(value);
    }
    set(this, '_value', value);
  },

  actions: {
    handleChanged(_value) {
      set(this, '_value', _value);
      if (typeof this.sanitizeValue === 'function') {
        let originalValue = _value;

        _value = this.sanitizeValue(_value);

        if (originalValue !== _value) {
          set(this, '_value', _value);
        }
      }

      this.send('changed', _value);
    },

    changed(value) {
      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(value);
      }
    }
  }
});
