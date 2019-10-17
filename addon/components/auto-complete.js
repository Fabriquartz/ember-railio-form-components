import { classNames, className, layout }              from '@ember-decorators/component';
import Component                                      from '@ember/component';
import { not }                                        from '@ember/object/computed';
import { action, computed, defineProperty, get, set } from '@ember/object';
import invokeAction                                   from 'ember-invoke-action';
import formFieldOptions                               from 'ember-railio-form-components/mixins/form-field-options';

import template                                       from '../templates/components/auto-complete';
import groupBy                                        from '../utils/group-by';

export default
@classNames('auto-complete')
@layout(template)
class AutoComplete extends Component.extend(formFieldOptions) {
  @not('disableClear') allowClear;
  @not('disableSearch') searchEnabled;

  didReceiveAttrs() {
    if (!get(this, 'groupedContent')) {
      let groupLabelPath = get(this, 'groupLabelPath');

      defineProperty(this, 'groupedContent',
      computed(`content.@each.{${groupLabelPath}}`, 'sortFunction', function() {
        let sortFunction = get(this, 'sortFunction');
        let content      = get(this, 'content') || [];

        if (typeof content.sort !== 'function' &&
            typeof content.toArray === 'function') {
          content = content.toArray();
        }

        if (sortFunction && typeof sortFunction === 'function') {
          content = content.sort(sortFunction);
        }
        return groupBy(content, groupLabelPath);
      }));
    }
  }

  onKeyDownDropDown(powerSelect, keydown) {
    // Open when typing for search (only characters)
    if (keydown.keyCode >= 48 && keydown.keyCode <= 90) {
      powerSelect.actions.open();
    }
  }

  @className('auto-complete--selected-all')
  @computed('content.[]', 'value.[]')
  get _selectAll() {
    let content = get(this, 'content') || [];
    let value   = get(this, 'value') || [];

    return (
      get(content, 'length') === get(value, 'length') &&
      value.every((item) => content.includes(item))
    );
  }

  @action
  update(value) {
    set(this, '_selectAll', false);
    invokeAction(this, 'updated', value);
  }

  @action
  updateSelectAll(selectAll) {
    set(this, '_selectAll', selectAll);

    if (!selectAll) {
      return this.attrs.updated([]);
    }

    if (typeof this.attrs.updated === 'function') {
      this.attrs.updated(get(this, 'content'));
    }
  }

  @action
  onDoubleClickItem(multiSelect, item) {
    if (multiSelect) {
      invokeAction(this, 'doubleClickItem', item);
    }
  }
}
