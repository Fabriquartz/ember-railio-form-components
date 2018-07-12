import PaperTextField from
  'ember-railio-form-components/components/paper-text-field';
import get            from 'ember-metal/get';

export default PaperTextField.extend({
  layoutName: 'components/paper-text-field',
  classNames: ['search-input'],

  actions: {
    changed() {
      this.sendAction('onQueryChange', get(this, 'value'));
    }
  }
});
