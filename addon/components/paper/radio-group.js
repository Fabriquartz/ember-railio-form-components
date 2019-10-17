import { layout }       from '@ember-decorators/component';
import Component        from '@ember/component';
import { action, set }  from '@ember/object';
import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';
import template         from 'ember-railio-form-components/templates/components/paper/radio-group';

export default
@layout(template)
class PaperRadioGroup extends Component.extend(formFieldOptions) {
  @action
  changed(value) {
    set(this, 'selectedOption', value);
    this.updated(value);
  }
}
