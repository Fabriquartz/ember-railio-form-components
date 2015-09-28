import Ember from 'ember';

export default Ember.Component.extend({
  object: Ember.Object.create({
    number: -3.4,
    text: 'test text',
    radioValue: ''
  }),

  optionList: ['OPTION 1', 'OPTION 2', 'OPTION 3'],

  actions: {
    update(object, propertyPath, value) {
      object.set(propertyPath, value);
    }
  }
});
