import Component                         from '@ember/component';
import { reads }                         from '@ember/object/computed';
import { get, defineProperty, computed } from '@ember/object';
import { isEmpty }                       from '@ember/utils';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  classNames:        'form-field',
  classNameBindings: [
    'isValid::form-field--invalid',
    'isChanged:form-field--changed',
    'isDifferent:form-field--different',
    'after:form-field--has-after'],

  _label: computed('label', 'propertyPath', function() {
    let label        = get(this, 'label');
    let propertyPath = get(this, 'propertyPath');

    return label === false ? '' : label || propertyPath;
  }),

  validateUpdateAction() {
    let updated = get(this, 'updated');

    if (!updated) {
      throw new Error(`You must provide an 'update' action to '{{form-field}}.`);
    } else if (typeof updated !== 'function') {
      throw new Error(`The 'update' action on '{{form-field}} must be a function.`);
    }
  },

  didReceiveAttrs() {
    this.validateUpdateAction();

    let originPath   = this.get('originPath');
    let propertyPath = this.get('propertyPath');

    let changedPath  = originPath || propertyPath;

    defineProperty(this, 'isChanged',   reads(`object.${changedPath}IsChanged`));
    defineProperty(this, 'isDifferent', reads(`object.${propertyPath}IsDifferent`));

    this._super(...arguments);
  },

  errors: computed('propertyPath', 'object.errors.[]', function() {
    let propertyPath = get(this, 'propertyPath');

    return get(this, 'object.errors').errorsFor(propertyPath);
  }),

  isValid: computed('errors.[]', function() {
    return isEmpty(get(this, 'errors'));
  }),

  actions: {
    update(value, ...args) {
      if (get(this, 'disabled')) { return; }

      let object       = get(this, 'object');
      let propertyPath = get(this, 'propertyPath');

      this.updated(object, propertyPath, value, ...args);
    }
  }
});
