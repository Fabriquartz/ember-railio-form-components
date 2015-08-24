import Ember from 'ember';
import textInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default Ember.Component.extend(textInputMixin, {
  tagName:    'textarea',
  classNames: ['text-area']
});
