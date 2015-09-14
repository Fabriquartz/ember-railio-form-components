import Ember from 'ember';

const { computed, defineProperty } = Ember;
const { reads } = computed;

function spliceCapitalizedString(string) {
  string = string.replace(/([A-Z])/g, ' $1');
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isValidComputedProperty() {
  const errorsPath     = this.get('errorsPath');
  const propertyErrors = this.get(errorsPath);
  return propertyErrors == null || propertyErrors.length === 0;
}

export default Ember.Component.extend({
  classNames: 'form-field',
  classNameBindings: [
    'isValid::form-field--invalid',
    'isChanged:form-field--changed',
    'isDifferent:form-field--different'],

  labelText: computed('label', 'propertyPath', function() {
    const propertyPath = this.get('propertyPath');
    let label          = this.get('label');

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

  didReceiveAttrs: function() {
    if (!this.attrs.updated) {
      throw new Error(`You must provide an 'update' action to '{{form-field}}.`);
    } else if (typeof this.attrs.updated !== 'function') {
      throw new Error(`The 'update' action on '{{form-field}} must be a function.`);
    }
    const originPath   = this.get('originPath');
    const propertyPath = this.get('propertyPath');
    const errorsPath   = this.get('errorsPath');
    const changedPath  = originPath || propertyPath;

    defineProperty(this, 'isValid', computed(errorsPath, isValidComputedProperty));
    defineProperty(this, 'isChanged', reads(`object.${changedPath}IsChanged`));
    defineProperty(this, 'isDifferent', reads(`object.${propertyPath}IsDifferent`));
  },

  actions: {
    update: function(value) {
      const object       = this.get('object');
      const propertyPath = this. get('propertyPath');

      if (!this.get('disabled') && typeof this.attrs.updated === 'function') {
        this.attrs.updated(object, propertyPath, value);
      }
    }
  }
});
