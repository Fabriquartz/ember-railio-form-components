import { computed } from '@ember/object';

import groupBy      from '../group-by';

export default function(contentPath, groupPath) {
  return computed(contentPath, groupPath, function() {
    return groupBy(this.get(contentPath), this.get(groupPath));
  });
}
