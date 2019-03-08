import Component from 'ember-component';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

import layout from
  'ember-railio-form-components/templates/components/select-auto-complete';

export default Component.extend(formFieldOptions, {
  classNames: ['select-auto-complete'],
  layout,

  actions: {
    onQueryChange(query) {
      this.onQueryChange && this.onQueryChange(query);
    }
  }
});
