import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { get, defineProperty, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

import layout from '../templates/components/paper-form-field';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  layout,

  classNames: 'form-field',
  classNameBindings: [
    'isValid::form-field--invalid',
    'isChanged:form-field--changed',
    'isDifferent:form-field--different',
    'after:form-field--has-after',
  ],

  _label: computed('label', 'propertyPath', function () {
    let label = this.label;
    let propertyPath = this.propertyPath;

    return label === false ? '' : label || propertyPath;
  }),

  validateUpdateAction() {
    let updated = this.updated;

    if (!updated) {
      throw new Error(
        `You must provide an 'update' action to '{{form-field}}.`
      );
    } else if (typeof updated !== 'function') {
      throw new Error(
        `The 'update' action on '{{form-field}} must be a function.`
      );
    }
  },

  didReceiveAttrs() {
    this.validateUpdateAction();

    let originPath = this.originPath;
    let propertyPath = this.propertyPath;

    let changedPath = originPath || propertyPath;

    defineProperty(this, 'isChanged', reads(`object.${changedPath}IsChanged`));
    defineProperty(
      this,
      'isDifferent',
      reads(`object.${propertyPath}IsDifferent`)
    );

    this._super(...arguments);
  },

  errors: computed('propertyPath', 'object.errors.length', function () {
    let propertyPath = this.propertyPath;
    let errors = get(this, 'object.errors');

    return errors && errors.errorsFor && errors.errorsFor(propertyPath);
  }),

  isValid: computed('errors.[]', function () {
    return isEmpty(this.errors);
  }),

  actions: {
    update(value, ...args) {
      if (this.disabled) {
        return;
      }

      let object = this.object;
      let propertyPath = this.propertyPath;

      this.updated(object, propertyPath, value, ...args);
    },
  },
});
