import Ember from 'ember';
import layout from '../templates/components/model-picker';

const {
  get,
  inject: { service },
  RSVP: { resolve }
} = Ember;

export default Ember.Component.extend({
  layout,
  store: service(),

  actions: {
    lookupModel(query) {
      const model          = get(this, 'model');
      const searchProperty = get(this, 'searchProperty');
      const groupLabelPath = get(this, 'groupLabelPath');
      const sortFunction   = get(this, 'sortFunction');
      const filter         = {};
      filter[searchProperty] = query;

      let list = get(this, 'store').query(model, filter);

      return resolve(list).then((list) => {
        const groups = Ember.A();

        if (typeof list.sort !== 'function' &&
            typeof list.toArray === 'function') {
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
                options:   Ember.A()
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
    }
  }
});
