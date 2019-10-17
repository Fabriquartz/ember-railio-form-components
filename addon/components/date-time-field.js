import { layout, classNames } from '@ember-decorators/component';
import Component              from '@ember/component';
import { action }             from '@ember/object';
import formFieldOptions       from 'ember-railio-form-components/mixins/form-field-options';

import template               from '../templates/components/date-time-field';

export default
@layout(template)
@classNames('date-time-row')
class DateTimeField extends Component.extend(formFieldOptions) {
  @action
  setDatetimeToCurrent() {
    if (!this.get('disabled')) {
      this.send('changed', new Date());
    }
  }
  @action
  clearDateTime() {
    if (!this.get('disabled')) {
      this.send('changed', null);
    }
  }
  @action
  changed(value) {
    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(value);
    }
  }
}
