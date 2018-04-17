import Component   from 'ember-component';
import EmberObject from 'ember-object';

export default Component.extend({
  object: EmberObject.create({
    number:     -3.4,
    text:       'test text',
    textArea:   'This is a text area',
    radioValue: ''
  }),

  optionList: ['OPTION 1', 'OPTION 2', 'OPTION 3'],

  textAreaOptions: {
    sizeOnInput: true
  },

  actions: {
    update(object, propertyPath, value) {
      object.set(propertyPath, value);
    }
  }
});
