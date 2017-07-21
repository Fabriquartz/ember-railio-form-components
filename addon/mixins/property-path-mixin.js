import Ember from 'ember';
import Mixin from 'ember-metal/mixin';

import { alias } from 'ember-computed';
import observer  from 'ember-metal/observer';

const { Binding, defineProperty } = Ember;

// TODO: Use Ember.Binding
export default Mixin.create({
  classNameBindings: ['valuesDiffer:different-value', 'valuesUnsaved:unsaved'],

  propertyPathDidChange: observer('propertyPath', 'propertyTarget', 'originPath',
  function() {
    let propertyPath = this.get('propertyPath');
    let targetPath   = this.get('propertyTarget');
    let originPath   = this.get('originPath');

    if (typeof propertyPath === 'string') {
      propertyPath = `object.${propertyPath}`;

      let differKey = `${propertyPath}IsDifferent`;
      let unsavedKey;

      if (originPath) {
        unsavedKey = `object.${originPath}IsChanged`;
      } else {
        unsavedKey = `${propertyPath}IsChanged`;
      }

      defineProperty(this, 'valuesDiffer', alias(differKey));
      defineProperty(this, 'valuesUnsaved', alias(unsavedKey));

      let propertyBinding = this.get('propertyBinding');

      if (propertyBinding != null &&
          typeof propertyBinding.disconnect === 'function') {
        propertyBinding.disconnect(this);
      }

      if (typeof propertyPath === 'string' && typeof targetPath === 'string') {
        propertyBinding = Binding.from(propertyPath).to(targetPath);
        propertyBinding.connect(this);
      }
    }
  }).on('init')
});
