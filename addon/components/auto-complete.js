import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/auto-complete';

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['auto-complete'],
  layout: layout,

  groupedContent: computed('content.[]', 'groupLabelPath', function() {
    let groupPath = get(this, 'groupLabelPath');
    let content   = get(this, 'content');
    let groups    = Ember.A();

    if (!groupPath) {
      return content;
    }

    if (content && content.length) {
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
    }

    return groups;
  })
});
