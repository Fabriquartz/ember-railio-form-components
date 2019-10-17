import { classNames } from '@ember-decorators/component';
import { action }     from '@ember/object';
import TextField      from 'ember-railio-form-components/components/text-field';

export default
@classNames('search-input')
class SearchInput extends TextField {
  @action
  changed(value) {
    super.changed(...arguments);
    this.onQueryChange && this.onQueryChange(value);
  }
}
