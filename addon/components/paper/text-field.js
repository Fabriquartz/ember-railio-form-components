import { layout }                     from '@ember-decorators/component';
import Component                      from '@ember/component';
import { action, computed, get, set } from '@ember/object';
import formFieldOptions               from 'ember-railio-form-components/mixins/form-field-options';
import template                       from 'ember-railio-form-components/templates/components/paper/input-field';

function isFocusOutEvent(event) {
  return event && event.type === 'focusout';
}

export default
@layout(template)
class PaperTextField extends Component.extend(formFieldOptions) {
  inputType = 'text';
  lazy = false;

  format(value) {
    return value;
  }

  serialize(value) {
    return value;
  }

  focusIn() {
    set(this, 'hasFocus', true);
  }

  focusOut(e) {
    set(this, 'hasFocus', false);
    this.send('changed', get(this, '_value'), e);
  }

  keyUp(e) {
    if (e.key === 'Enter') {
      typeof this.enter === 'function' && this.enter(e);
    }
    if (e.key === 'Escape') {
      typeof this.escape === 'function' && this.escape(e);
    }
  }

  keyDown() {}

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    if (!get(this, 'hasFocus')) {
      let value = get(this, 'value');
      set(this, '_value', this.format(value));
    }
  }

  @computed('htmlAttributes', 'name')
  get _htmlAttributes() {
    let name           = get(this, 'name');
    let htmlAttributes = get(this, 'htmlAttributes') || {};

    if (!htmlAttributes.name && name) {
      htmlAttributes.name = name;
    }
    return htmlAttributes;
  }

  @action
  changed(value, event, forceUpdate) {
    let lazy = get(this, 'lazy');

    let _value = forceUpdate || isFocusOutEvent(event) ? this.format(value) : value;

    set(this, '_value', _value);

    if (forceUpdate || !lazy || isFocusOutEvent(event)) {
      value = this.serialize(value);
      this.updated(value);
    }
  }
}
