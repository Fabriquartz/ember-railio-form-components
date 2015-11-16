import Ember from 'ember';
import TextInputMixin from 'ember-railio-form-components/mixins/text-input-mixin';

export default Ember.TextField.extend(TextInputMixin, {
  classNames: ['search-input'],
  type: 'search',

  actions: {
    changed() {
      this.sendAction('onQueryChange', this.get('value'));
    }
  }
});
