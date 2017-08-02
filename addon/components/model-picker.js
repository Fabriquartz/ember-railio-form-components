import Ember     from 'ember';
import Component from 'ember-component';
import layout    from '../templates/components/model-picker';

import { isBlank }       from 'ember-utils';
import { task, timeout } from 'ember-concurrency';
import groupBy from '../utils/group-by';

import computed from 'ember-computed';
import get      from 'ember-metal/get';
import service  from 'ember-service/inject';
import { A }    from 'ember-array/utils';

const { defineProperty } = Ember;

export default Component.extend({
  layout,
  store: service(),

  didReceiveAttrs() {
    let groupLabelPath = get(this, 'groupLabelPath');
    let sortProperty   = get(this, 'sortProperty');

    defineProperty(this, 'groupedContent',
    computed(`content.@each.{${groupLabelPath},${sortProperty}}`, 'sortFunction',
    function() {
      let content      = A(get(this, 'content') || []);
      let sortFunction = get(this, 'sortFunction');

      if (typeof content.sort !== 'function' &&
          typeof content.toArray === 'function') {
        content = content.toArray();
      }

      content = sortProperty ? content.sortBy(sortProperty) : content;
      content = sortFunction ? content.sort(sortFunction) : content;

      return groupBy(content, groupLabelPath);
    }));
  },

  content: computed('preload', 'model', function() {
    if (!get(this, 'preload')) {
      return [];
    }

    let store = get(this, 'store');
    let model = get(this, 'model');

    return store.query(model, {});
  }),

  lookupModel: task(function* (term) {
    if (isBlank(term)) { return []; }

    yield timeout(1000);

    let model              = get(this, 'model');
    let searchProperty     = get(this, 'searchProperty');
    let groupLabelPath     = get(this, 'groupLabelPath');
    let sortProperty       = get(this, 'sortProperty');
    let sortFunction       = get(this, 'sortFunction');
    let filter             = {};
    filter[searchProperty] = term;

    return get(this, 'store').query(model, filter).then((list) => {
      if (typeof list.sort !== 'function' && typeof list.toArray === 'function') {
        list = list.toArray();
      }

      list = sortProperty ? list.sortBy(sortProperty) : list;
      list = sortFunction ? list.sort(sortFunction) : list;
      return groupBy(list, groupLabelPath);
    });
  }).restartable()
});
