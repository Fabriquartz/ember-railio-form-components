import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { get } from '@ember/object';
import { defineProperty } from '@ember/object';

export default Mixin.create({
  didReceiveAttrs() {
    this._super(...arguments);

    let options = this.componentProperties || {};
    Object.keys(options).forEach((attributeName) => {
      if (typeof get(options, attributeName) === 'function') {
        defineProperty(this, attributeName, {
          value: get(options, attributeName),
        });
        return;
      }

      defineProperty(
        this,
        attributeName,
        reads(`componentProperties.${attributeName}`)
      );
    });
  },
});
