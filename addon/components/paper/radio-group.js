import Component from '@ember/component';
import { set }   from '@ember/object';

import layout from
  'ember-railio-form-components/templates/components/paper/radio-group';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  layout,

  actions: {
    changed(value) {
      set(this, 'selectedOption', value);
      this.updated(value);
    }
  }
});
