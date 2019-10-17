import { layout, classNames, className, attribute } from '@ember-decorators/component';
import Component                                    from '@ember/component';
import { action, computed, get }                    from '@ember/object';
import formFieldOptions                             from 'ember-railio-form-components/mixins/form-field-options';

import template                                     from '../templates/components/radio-select';

export default
@layout(template)
@classNames('radio-select')
class RadioSelect extends Component.extend(formFieldOptions) {
  showIcon = true;
  defaultEmpty = 'No option selected';

  @className('radio-select--inline') inline = false;

  @attribute
  @computed('cycle', 'value', 'options')
  get title() {
    if (get(this, 'cycle')) {
      let next            = this._getNextOption();
      let optionLabelPath = get(this, 'optionLabelPath');

      if (optionLabelPath) {
        next = get(next, optionLabelPath);
      }

      return `Click to change value to ${next}`;
    }

    return '';
  }

  _getNextOption() {
    let value           = get(this, 'value');
    let options         = get(this, 'options');
    let optionValuePath = get(this, 'optionValuePath');

    if (optionValuePath) {
      options = options.map((option) => {
        return get(option, optionValuePath);
      });
    }

    let newIndex = options.indexOf(value) + 1;
    let newValue = null;

    if (newIndex < options.length) {
      newValue = options[newIndex];
    } else {
      newValue = options[0];
    }

    return newValue;
  }

  @action
  selectItem(value) {
    let cycle = get(this, 'cycle');

    if (cycle) {
      value = this._getNextOption();
    }

    this.updated(value);
  }
}
