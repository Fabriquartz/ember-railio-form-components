import Ember from 'ember';
import Mixin from 'ember-metal/mixin';
import get   from 'ember-metal/get';

const { defineProperty } = Ember;

export default Mixin.create({
  didReceiveAttrs() {
    this._super(...arguments);

    let options = get(this, 'options') || {};

    Object.keys(options).forEach((attributeName) => {
      defineProperty(this, attributeName, { value: get(options, attributeName) });
    });
  }
});