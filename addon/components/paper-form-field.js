import { layout, classNames, classNameBindings } from '@ember-decorators/component';
import Component                                 from '@ember/component';
import { reads }                                 from '@ember/object/computed';
import { action, computed, defineProperty, get } from '@ember/object';
import { isEmpty }                               from '@ember/utils';
import formFieldOptions                          from 'ember-railio-form-components/mixins/form-field-options';

import template                                  from '../templates/components/paper-form-field';

export default
@layout(template)
@classNames('form-field')
@classNameBindings(
  'isValid::form-field--invalid',
  'isChanged:form-field--changed',
  'isDifferent:form-field--different',
  'after:form-field--has-after'
)
class PaperFormField extends Component.extend(formFieldOptions) {
  validateUpdateAction() {
    let updated = get(this, 'updated');

    if (!updated) {
      throw new Error(`You must provide an 'update' action to '{{form-field}}.`);
    } else if (typeof updated !== 'function') {
      throw new Error(`The 'update' action on '{{form-field}} must be a function.`);
    }
  }

  didReceiveAttrs() {
    this.validateUpdateAction();

    let originPath   = this.get('originPath');
    let propertyPath = this.get('propertyPath');

    let changedPath = originPath || propertyPath;

    defineProperty(this, 'isChanged', reads(`object.${changedPath}IsChanged`));
    defineProperty(this, 'isDifferent', reads(`object.${propertyPath}IsDifferent`));

    this._super(...arguments);
  }

  @computed('label', 'propertyPath')
  get _label() {
    let label        = get(this, 'label');
    let propertyPath = get(this, 'propertyPath');

    return label === false ? '' : label || propertyPath;
  }

  @computed('propertyPath', 'object.errors.length')
  get errors() {
    let propertyPath = get(this, 'propertyPath');
    let errors       = get(this, 'object.errors');

    return errors && errors.errorsFor && errors.errorsFor(propertyPath);
  }

  @computed('errors.[]')
  get isValid() {
    return isEmpty(get(this, 'errors'));
  }

  @action
  update(value, ...args) {
    if (get(this, 'disabled')) {
      return;
    }

    let object       = get(this, 'object');
    let propertyPath = get(this, 'propertyPath');

    this.updated(object, propertyPath, value, ...args);
  }
}
