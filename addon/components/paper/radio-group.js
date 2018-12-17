import Component from '@ember/component';
import { set }   from '@ember/object';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  actions: {
    changed(value) {
      set(this, 'selectedOption', value);
      this.updated(value);
    }
  }
});
