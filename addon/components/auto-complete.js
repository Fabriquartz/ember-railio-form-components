import Ember     from 'ember';
import Component from 'ember-component';
import layout    from '../templates/components/auto-complete';
import groupBy   from '../utils/group-by';
import get       from 'ember-metal/get';

import computed, { not } from 'ember-computed';

const { defineProperty } = Ember;

export default Component.extend({
  classNames: ['auto-complete'],
  layout,

  allowClear:    not('disableClear'),
  searchEnabled: not('disableSearch'),

  didReceiveAttrs() {
    let groupLabelPath = get(this, 'groupLabelPath');

    defineProperty(this, 'groupedContent',
    computed(`content.@each.{${groupLabelPath}}`, 'sortFunction', function() {
      let sortFunction = get(this, 'sortFunction');
      let content      = get(this, 'content') || [];

      if (typeof content.sort !== 'function' &&
          typeof content.toArray === 'function') {
        content = content.toArray();
      }

      content = content.sort(sortFunction);
      return groupBy(content, groupLabelPath);
    }));
  }
});
