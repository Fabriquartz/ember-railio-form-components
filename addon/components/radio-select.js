import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['radio-select'],
  classNameBindings: ['inline:radio-select--inline'],
  showIcon: true,
  inline: false
});
