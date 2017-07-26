import Ember     from 'ember';
import Component from 'ember-component';
import layout    from '../templates/components/auto-complete';
import groupBy   from '../utils/group-by';
import computed  from 'ember-computed';
import get       from 'ember-metal/get';

const { defineProperty } = Ember;

export default Component.extend({
  classNames: ['auto-complete'],
  layout,

  didReceiveAttrs() {
    let groupLabelPath = get(this, 'groupLabelPath');

    defineProperty(this, 'groupedContent',
    computed(`content.@each.{${groupLabelPath}}`, function() {
      return groupBy(get(this, 'content'), groupLabelPath);
    }));
  }
});
