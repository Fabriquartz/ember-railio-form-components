import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

import layout from '../templates/components/model-picker';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

import { task, timeout } from 'ember-concurrency';
import invokeAction from 'ember-invoke-action';
import groupBy from '../utils/group-by';

export default Component.extend(formFieldOptions, {
  classNames: ['model-picker'],
  layout,

  pageSizeParam: 'per_page',

  store: service(),

  _selectAll: computed('multiSelect', 'content.[]', 'value.[]', function () {
    let content = this.content || [];
    let value = this.value || [];

    return (
      this.multiSelect &&
      content &&
      value &&
      content.length &&
      value.length &&
      content.length === value.length &&
      value.every((item) => content.includes(item))
    );
  }),

  emptyValue: [],

  lookupOnSearch: computed('preload', 'queryOnSearch', function () {
    let preload = this.preload;
    let queryOnSearch = this.queryOnSearch;

    return queryOnSearch || !preload;
  }),

  content: computed('filter', 'model', 'pageSizeParam', 'preload', function () {
    let filter = this.filter;
    let preload = this.preload;

    if (!preload) {
      return [];
    }

    let store = this.store;
    let model = this.model;

    let query = { filter };

    if (typeof preload == 'number') {
      query[this.pageSizeParam] = preload;
    }
    return store.query(model, query);
  }),

  lookupModel: task(function* (term) {
    if (isBlank(term)) {
      return [];
    }

    yield timeout(1000);

    let model = this.model;
    let searchProperty = this.searchProperty;
    let groupLabelPath = this.groupLabelPath;
    let sortFunction = this.sortFunction;
    let filter = this.filter || {};
    let query = { filter };
    query[searchProperty] = term;

    return this.store.query(model, query).then((list) => {
      if (
        typeof list.sort !== 'function' &&
        typeof list.toArray === 'function'
      ) {
        list = list.toArray();
      }

      if (sortFunction) {
        list.sort(sortFunction);
      }
      return groupBy(list, groupLabelPath);
    });
  }).restartable(),

  actions: {
    update(value) {
      invokeAction(this, 'updated', value);
    },
  },
});
