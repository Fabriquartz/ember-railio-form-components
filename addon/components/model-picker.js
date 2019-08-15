import Component             from '@ember/component';
import { computed, get }     from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank }           from '@ember/utils';

import layout from '../templates/components/model-picker';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

import { task, timeout } from 'ember-concurrency';
import invokeAction      from 'ember-invoke-action';
import groupBy           from '../utils/group-by';

export default Component.extend(formFieldOptions, {
  classNames: ['model-picker'],
  layout,

  pageSizeParam: 'per_page',

  store: service(),

  _selectAll: computed('multiSelect', 'content.[]', 'value.[]', function() {
    let content = get(this, 'content') || [];
    let value = get(this, 'value') || [];

    return (
      get(this, 'multiSelect') &&
      content &&
      value &&
      get(content, 'length') &&
      get(value, 'length') &&
      get(content, 'length') === get(value, 'length') &&
      value.every((item) => content.includes(item))
    );
  }),

  emptyValue: [],

  lookupOnSearch: computed('preload', 'queryOnSearch', function() {
    let preload = get(this, 'preload');
    let queryOnSearch = get(this, 'queryOnSearch');

    return queryOnSearch || !preload;
  }),

  content: computed('preload', 'model', 'filter', function() {
    let filter  = get(this, 'filter');
    let preload = get(this, 'preload');

    if (!preload) {
      return [];
    }

    let store = get(this, 'store');
    let model = get(this, 'model');

    let query = { filter };

    if (typeof preload == 'number') {
      query[get(this, 'pageSizeParam')] = preload;
    }
    return store.query(model, query);
  }),

  lookupModel: task(function* (term) {
    if (isBlank(term)) {
      return [];
    }

    yield timeout(1000);

    let model = get(this, 'model');
    let searchProperty = get(this, 'searchProperty');
    let groupLabelPath = get(this, 'groupLabelPath');
    let sortFunction = get(this, 'sortFunction');
    let filter = get(this, 'filter') || {};
    let query = { filter };
    query[searchProperty] = term;

    return get(this, 'store')
      .query(model, query)
      .then((list) => {
        if (typeof list.sort !== 'function' && typeof list.toArray === 'function') {
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
    }
  }
});
