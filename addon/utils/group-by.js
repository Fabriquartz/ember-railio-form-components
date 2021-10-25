import EmberObject from '@ember/object';

import { A } from '@ember/array';
import { get } from '@ember/object';

export default function groupBy(content, groupPath) {
  let groups = A();

  if (!groupPath) {
    return content;
  }

  if (content && content.length) {
    content.forEach((item) => {
      let label = get(item, groupPath);

      if (label) {
        let group = groups.findBy('groupName', label);

        if (group == null) {
          group = EmberObject.create({
            groupName: label,
            options: A(),
          });

          groups.pushObject(group);
        }

        group.options.pushObject(item);
      } else {
        groups.pushObject(item);
      }
    });
  }

  return groups;
}
