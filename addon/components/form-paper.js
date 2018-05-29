import Component        from 'ember-component';
import textInputMixin   from 'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

import layout from '../templates/components/form-paper';


export default Component.extend(textInputMixin, formFieldOptions, {
  classNames: ['text-field'],
  layout,

  actions: {
    update(value) {
      invokeAction(this, 'updated', value);
    },

    removeItem(item) {
      let value    = get(this, 'value') || [];
      this.send('update', value.removeObject(item));
    },

    addItem(item) {
      let value    = get(this, 'value') || [];
      this.send('update', value.pushObject(item));
    }
  }
});
