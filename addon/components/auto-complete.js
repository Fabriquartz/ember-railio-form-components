import Ember from 'ember';
import Component from '@ember/component';
import layout from '../templates/components/auto-complete';
import groupBy from '../utils/group-by';
import invokeAction from 'ember-invoke-action';
import { get } from '@ember/object';
import { set } from '@ember/object';

import { computed } from '@ember/object';
import { not } from '@ember/object/computed';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

const { defineProperty } = Ember;

export default Component.extend(formFieldOptions, {
  classNames: ['auto-complete'],
  classNameBindings: ['_selectAll:auto-complete--selected-all'],
  layout,

  _selectAll: computed('content.[]', 'value.[]', function () {
    let content = this.content || [];
    let value = this.value || [];

    return (
      content.length === value.length &&
      value.every((item) => content.includes(item))
    );
  }),

  allowClear: not('disableClear'),
  searchEnabled: not('disableSearch'),

  didReceiveAttrs() {
    this._super();
    if (!this.groupedContent) {
      let groupLabelPath = this.groupLabelPath;

      defineProperty(
        this,
        'groupedContent',
        computed(
          `content.@each.{${groupLabelPath}}`,
          'content',
          'sortFunction',
          function () {
            let sortFunction = this.sortFunction;
            let content = this.content || [];

            if (
              typeof content.sort !== 'function' &&
              typeof content.toArray === 'function'
            ) {
              content = content.toArray();
            }

            if (sortFunction && typeof sortFunction === 'function') {
              content = content.sort(sortFunction);
            }
            return groupBy(content, groupLabelPath);
          }
        )
      );
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
      invokeAction(this, 'updated', value);
    },
    updateSelectAll(selectAll) {
      set(this, '_selectAll', selectAll);

      if (!selectAll) {
        return this.attrs.updated([]);
      }

      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(this.content);
      }
    },
    doubleClickItem(multiSelect, item) {
      if (multiSelect) {
        invokeAction(this, 'doubleClickItem', item);
      }
    },
  },
});
