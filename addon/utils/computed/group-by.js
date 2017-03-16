import computed from 'ember-computed';
import get from 'ember-metal/get';

import groupBy from '../group-by';

export default function(contentPath, groupPath) {
  return computed(contentPath, groupPath, function() {
    return groupBy(this.get(contentPath), this.get(groupPath));
  });
}
