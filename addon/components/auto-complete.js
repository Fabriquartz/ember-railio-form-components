import Ember        from 'ember';
import Component    from 'ember-component';
import layout       from '../templates/components/auto-complete';
import groupBy      from '../utils/group-by';
import invokeAction from 'ember-invoke-action';
import get          from 'ember-metal/get';
import set          from 'ember-metal/set';

import computed, { not } from 'ember-computed';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

const { defineProperty } = Ember;

export default Component.extend(formFieldOptions, {
  classNames:        ['auto-complete'],
  classNameBindings: ['_selectAll:auto-complete--selected-all'],
  layout,

  _selectAll: computed('content.[]', 'value.[]', function() {
    let content = get(this, 'content') || [];
    let value   = get(this, 'value') || [];

    return get(content, 'length') === get(value, 'length') &&
           value.every((item) => content.includes(item));
  }),

  allowClear:    not('disableClear'),
  searchEnabled: not('disableSearch'),

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
  },

  onKeyDownDropDown(powerSelect, keydown) {
    // Open when typing for search (only characters)
    if (keydown.keyCode >= 48 && keydown.keyCode <= 90) {
      powerSelect.actions.open();
    }
  },

  actions: {
    update(value) {
      set(this, '_selectAll', false);
      console.log("value in autocomp", value)
      invokeAction(this, 'updated', value);
    },
    updateSelectAll(selectAll) {
      set(this, '_selectAll', selectAll);

      if (!selectAll) { return this.attrs.updated([]); }

      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(get(this, 'content'));
      }
    },
    doubleClickItem(multiSelect, item) {
      if (multiSelect) { invokeAction(this, 'doubleClickItem', item); }
    }
  }
});
