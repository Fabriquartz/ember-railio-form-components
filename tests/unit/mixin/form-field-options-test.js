import { moduleFor, test } from 'ember-qunit';

import FormFieldOptionsMixin from
  'ember-railio-form-components/mixins/form-field-options';

import Component from 'ember-component';
import getOwner  from 'ember-owner/get';
import get       from 'ember-metal/get';

moduleFor('mixin:form-field-options', 'Unit | Mixin | form-field-options', {
  integration: true,

  subject() {
    let formComponent = Component.extend(FormFieldOptionsMixin, {
      options: {
        fooBar: 'Value for FooBar',
        fizBox: () => 'Value for FizBoz'
      }
    });

    this.register('component:form-field', formComponent);
    return getOwner(this).lookup('component:form-field');
  }
});

test('Binds options to the context', function(assert) {
  let formField = this.subject();
  assert.equal(get(formField, 'fooBar'), 'Value for FooBar',
               'Property binded to the context');
  assert.equal(get(formField, 'fizBox')(), 'Value for FizBoz',
               'Function binded to the context');
});