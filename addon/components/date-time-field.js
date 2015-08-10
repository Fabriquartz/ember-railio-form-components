import Ember from 'ember';
import PropertyPathMixin from 'ember-railio-form-components/mixins/property-path-mixin';

export default Ember.Component.extend(PropertyPathMixin, {
  classNames: ['date-time-row'],
  propertyTarget: 'datetime',

  actions: {
    setDatetimeToCurrent: function() {
      if (!this.get('disabled')) {
        this.set('datetime', new Date());
      }
    },

    clearDateTime: function() {
      if (!this.get('disabled')) {
        this.set('datetime', null);
      }
    }
  }
});
