import Component      from 'ember-component';
import textInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default Component.extend(textInputMixin, {
  tagName:           'textarea',
  classNames:        ['text-area'],
  attributeBindings: ['disabled']
});
