import TextField      from 'ember-components/text-field';
import TextInputMixin from
  'ember-railio-form-components/mixins/text-input-mixin';
import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default TextField.extend(TextInputMixin, formFieldOptions, {
  classNames: ['search-input'],

  actions: {
    changed() {
      this.onQueryChange && this.onQueryChange(this.get('value'));
    }
  }
});
