import Ember               from 'ember';
import Component           from 'ember-component';
import computed, { reads } from 'ember-computed';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

const { defineProperty } = Ember;

function spliceCapitalizedString(string) {
  string = string.replace(/([A-Z])/g, ' $1');
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isValidComputedProperty() {
  let errorsPath     = this.get('errorsPath');
  let propertyErrors = this.get(errorsPath);
  return propertyErrors == null || propertyErrors.length === 0;
}

export default Component.extend(formFieldOptions, {
  classNames:        'form-field',
  classNameBindings: [
    'isValid::form-field--invalid',
    'isChanged:form-field--changed',
    'isDifferent:form-field--different'],

  labelText: computed('label', 'propertyPath', function() {
    let propertyPath = this.get('propertyPath');
    let label        = this.get('label');

    if (typeof label === 'string') {
      return label;
    }

    if (label == null && propertyPath != null) {
      return spliceCapitalizedString(propertyPath);
    }

    return null;
  }),

  errorsPath: computed('propertyPath', function() {
    return `object.errors.${this.get('propertyPath')}`;
  }),

  didReceiveAttrs() {
    if (!this.attrs.updated) {
      throw new Error(`You must provide an 'update' action to '{{form-field}}.`);
    } else if (typeof this.attrs.updated !== 'function') {
      throw new Error(`The 'update' action on '{{form-field}} must be a function.`);
    }
    let originPath   = this.get('originPath');
    let propertyPath = this.get('propertyPath');
    let errorsPath   = this.get('errorsPath');
    let changedPath  = originPath || propertyPath;

    defineProperty(this, 'isValid', computed(errorsPath, isValidComputedProperty));
    defineProperty(this, 'isChanged', reads(`object.${changedPath}IsChanged`));
    defineProperty(this, 'isDifferent', reads(`object.${propertyPath}IsDifferent`));
  },

  actions: {
    update(value) {
      let object       = this.get('object');
      let propertyPath = this.get('propertyPath');

      if (!this.get('disabled') && typeof this.attrs.updated === 'function') {
        this.attrs.updated(object, propertyPath, value);
      }
    }
  }
});
