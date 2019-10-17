import { attributeBindings } from '@ember-decorators/component';
import Component             from '@ember/component';
import { action, get, set }  from '@ember/object';

export default
@attributeBindings('_value:value', 'disabled', 'placeholder', 'name')
class TextInput extends Component {
  handleChanged(event) {
    let value = this.readDOMAttr('value');

    if (typeof this.sanitizeValue === 'function') {
      let originalValue = value;
      let [input]       = this.$();
      let caretPos      = input.selectionStart;

      value = this.sanitizeValue(value);

      if (originalValue !== value) {
        this.$().val(value);
        input.setSelectionRange(caretPos - 1, caretPos - 1);
      }
    }

    this.send('changed', value, event);
  }

  input() {
    return this.handleChanged(...arguments);
  }
  change() {
    return this.handleChanged(...arguments);
  }

  focusIn() {
    if (typeof this.attrs.focusIn === 'function') {
      this.attrs.focusIn();
    }
  }

  focusOut() {
    let value = this.readDOMAttr('value');
    if (typeof this.attrs.focusOut === 'function') {
      this.attrs.focusOut();
    }

    if (typeof get(this, 'format') === 'function') {
      value = this.format(value);
      set(this, '_value', value);
    }

    this.send('changed', value);
  }

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
  }

  keyDown() {}

  didReceiveAttrs() {
    let value = this.getAttr('value');
    if (typeof this.formatValue === 'function') {
      value = this.formatValue(value);
    }
    this.set('_value', value);
  }

  @action
  changed(value, event) {
    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(value, event);
    }
  }
}
