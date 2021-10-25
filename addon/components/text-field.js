import Component from '@ember/component';
import textInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(textInputMixin, formFieldOptions, {
  tagName: 'input',
  classNames: ['text-field'],
});
