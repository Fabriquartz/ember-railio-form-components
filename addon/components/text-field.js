import Ember from 'ember';
import textInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default Ember.Component.extend(textInputMixin, {
  tagName:    'input',
  classNames: ['text-field'],
  inputType:  'text'
});
