import Component from 'ember-component';

export default Component.extend({
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
