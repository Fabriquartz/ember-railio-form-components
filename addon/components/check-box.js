import {
  attribute,
  attributeBindings,
  classNames,
  tagName
} from '@ember-decorators/component';
import Component        from '@ember/component';
import { action }       from '@ember/object';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

export default
@tagName('input')
@attributeBindings('value:checked', 'disabled')
@classNames('check-box')
class CheckBox extends Component.extend(formFieldOptions) {
  @attribute type = 'checkbox';

  change() {
    this.send('changed', this.readDOMAttr('checked'));
  }

  @action
  changed(value) {
    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(value);
    }
  }
}
