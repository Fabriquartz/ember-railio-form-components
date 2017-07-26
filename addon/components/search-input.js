import TextField      from 'ember-components/text-field';
import TextInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default TextField.extend(TextInputMixin, {
  classNames: ['search-input'],

  actions: {
    changed() {
      this.sendAction('onQueryChange', this.get('value'));
    }
  }
});
