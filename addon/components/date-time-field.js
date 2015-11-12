import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['date-time-row'],
  type: 'datetime',

  actions: {
    setDatetimeToCurrent: function() {
      if (!this.get('disabled')) {
        this.send('changed', new Date());
      }
    },

    clearDateTime: function() {
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
