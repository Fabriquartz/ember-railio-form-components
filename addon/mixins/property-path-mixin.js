import Ember from 'ember';
import Mixin from '@ember/object/mixin';

import { alias } from '@ember/object/computed';
import { observer } from '@ember/object';

const { Binding, defineProperty } = Ember;

// TODO: Use Ember.Binding
export default Mixin.create({
  classNameBindings: ['valuesDiffer:different-value', 'valuesUnsaved:unsaved'],

  propertyPathDidChange: observer(
    'propertyPath',
    'propertyTarget',
    'originPath',
    function () {
      let propertyPath = this.propertyPath;
      let targetPath = this.propertyTarget;
      let originPath = this.originPath;

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

        let propertyBinding = this.propertyBinding;

        if (
          propertyBinding != null &&
          typeof propertyBinding.disconnect === 'function'
        ) {
          propertyBinding.disconnect(this);
        }

        if (
          typeof propertyPath === 'string' &&
          typeof targetPath === 'string'
        ) {
          propertyBinding = Binding.from(propertyPath).to(targetPath);
          propertyBinding.connect(this);
        }
      }
    }
  ).on('init'),
});
