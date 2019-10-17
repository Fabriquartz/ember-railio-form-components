import { classNames, layout } from '@ember-decorators/component';
import { action }             from '@ember/object';
import Component              from 'ember-component';
import formFieldOptions       from 'ember-railio-form-components/mixins/form-field-options';
import template               from 'ember-railio-form-components/templates/components/select-auto-complete';

export default
@classNames('select-auto-complete')
@layout(template)
class SelectAutoComplete extends Component.extend(formFieldOptions) {
  @action
  queryChange(query) {
    this.onQueryChange && this.onQueryChange(query);
  }
}
