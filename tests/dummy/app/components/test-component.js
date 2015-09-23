import Ember from 'ember';

export default Ember.Component.extend({
  object: Ember.Object.create({
    number: -3.4,
    text: 'test text'
  }),

  actions: {
    update(object, propertyPath, value) {
      object.set(propertyPath, value);
    }
  }
});
