import Ember from 'ember';

const { computed, get } = Ember;

const pad = (number) => number < 10 ? `0${number}` : number;

const toDateString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toTimeString = (date) =>
  `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;

const isDate = (date) => date instanceof Date;

function handleChanged() {
  let value = this.readDOMAttr('value');

  this.send('changed', value);
}

export default Ember.Component.extend({
  tagName: 'input',
  classNames: ['date-picker'],
  attributeBindings: ['_type:type', '_date:value', 'disabled', 'name'],

  _type: 'date',

  input: handleChanged,
  change: handleChanged,

  _date: computed('value', function() {
    const value = get(this, 'value');
    return isDate(value) && toDateString(value);
  }),

  actions: {
    changed(date) {
      const datetime = get(this, 'value');
      const time = isDate(datetime) && toTimeString(datetime);
      const newDate = new Date(`${date} ${time}`);

      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(newDate);
      }
    }
  }
});
