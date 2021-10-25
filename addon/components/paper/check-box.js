import Component from '@ember/component';
import layout from 'ember-railio-form-components/templates/components/paper/check-box';

export default Component.extend({
  layout,

  actions: {
    changed(value) {
      this.updated(value);
    },
  },
});
