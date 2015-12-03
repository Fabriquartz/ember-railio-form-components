import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/auto-complete';
import invokeAction from 'ember-invoke-action';

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['auto-complete'],
  layout: layout,

  groupedContent: computed('content.[]', function() {
    const groupPath = get(this, 'groupLabelPath');
    const content   = get(this, 'content');
    const groups    = Ember.A();

    if (!groupPath) {
      return content;
    }

    content.forEach((item) => {
      const label = get(item, groupPath);

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
  }),

  actions: {
    emptySelection() {
      invokeAction(this, 'updated', null);
    }
  }
});
