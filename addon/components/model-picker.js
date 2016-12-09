import Ember     from 'ember';
import Component from 'ember-component';
import layout    from '../templates/components/model-picker';

import { isBlank }       from 'ember-utils';
import { task, timeout } from 'ember-concurrency';

import get     from 'ember-metal/get';
import service from 'ember-service/inject';
import { A }   from 'ember-array/utils';

const {
  RSVP: { resolve }
} = Ember;

export default Component.extend({
  layout,
  store: service(),

  lookupModel: task(function *(term) {
    if (isBlank(term)) { return []; }

    yield timeout(1000);

    let model              = get(this, 'model');
    let searchProperty     = get(this, 'searchProperty');
    let groupLabelPath     = get(this, 'groupLabelPath');
    let sortFunction       = get(this, 'sortFunction');
    let filter             = {};
    filter[searchProperty] = term;

    return get(this, 'store').query(model, filter).then((list) => {
      let groups = A();

      if (typeof list.sort !== 'function' && typeof list.toArray === 'function') {
        list = list.toArray();
      }

      list = list.sort(sortFunction);

      if (!groupLabelPath) {
        return list;
      }

      list.forEach((item) => {
        const label = get(item, groupLabelPath);

        if (label) {
          let group = groups.findBy('groupName', label);

          if (group == null) {
            group = Ember.Object.create({
              groupName: label,
              options:   A()
            });

            groups.pushObject(group);
          }

          get(group, 'options').pushObject(item);
        } else {
          groups.pushObject(item);
        }
      });

      return groups;
    });
  }).restartable()
});
