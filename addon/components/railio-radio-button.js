import { layout, classNames, className } from '@ember-decorators/component';
import Component                         from '@ember/component';
import { computed }                      from '@ember/object';
import { proxyIsEqual as isEqual }       from 'ember-proxy-util';
import formFieldOptions                  from 'ember-railio-form-components/mixins/form-field-options';
import template                          from 'ember-railio-form-components/templates/components/railio-radio-button';

export default
@layout(template)
@classNames('radio-select__option')
class RadioButton extends Component.extend(formFieldOptions) {
  @className('', 'no-icon')
  @computed('showIcon', 'inline')
  get icon() {
    if (this.get('inline')) {
      return false;
    }
    return this.get('showIcon');
  }

  @className('radio-select__option--selected')
  @computed('option', 'selection', 'optionValuePath')
  get checked() {
    let optionValuePath = this.get('optionValuePath');

    if (optionValuePath) {
      return this.get(`option.${optionValuePath}`) === this.get('selection');
    }

    return isEqual(this.get('option'), this.get('selection'));
  }

  @computed('option', 'optionLabelPath')
  get label() {
    let optionLabelPath = this.get('optionLabelPath');

    if (optionLabelPath) {
      return this.get(`option.${optionLabelPath}`);
    }
    return this.get('option');
  }

  click() {
    let optionValuePath = this.get('optionValuePath');
    let value           = this.get('option');

    if (optionValuePath) {
      value = this.get(`option.${optionValuePath}`);
    }

    if (typeof this.updated === 'function') {
      this.updated(value);
    }
  }
}
