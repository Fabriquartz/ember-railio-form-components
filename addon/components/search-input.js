import Ember from 'ember';
import TextInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default Ember.TextField.extend(TextInputMixin, {
  classNames: ['search-input'],

  actions: {
    changed() {
      this.sendAction('onQueryChange', this.get('value'));
    }
  }
});
