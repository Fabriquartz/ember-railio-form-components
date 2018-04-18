import Component from 'ember-component';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  classNames: ['date-time-row'],

  actions: {
    setDatetimeToCurrent() {
      if (!this.get('disabled')) {
        this.send('changed', new Date());
      }
    },

    clearDateTime() {
      if (!this.get('disabled')) {
        this.send('changed', null);
      }
    },

    changed(value) {
      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(value);
      }
    }
  }
});
