import Component       from 'ember-component';
import layout          from '../templates/components/auto-complete';
import computedGroupBy from '../utils/computed/group-by';

export default Component.extend({
  classNames: ['auto-complete'],
  layout: layout,

  groupedContent: computedGroupBy('content', 'groupLabelPath')
});
