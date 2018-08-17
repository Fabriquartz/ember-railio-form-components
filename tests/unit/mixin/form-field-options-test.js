import { moduleFor, test } from 'ember-qunit';

import FormFieldOptionsMixin from
  'ember-railio-form-components/mixins/form-field-options';

import Component from 'ember-component';
import getOwner  from 'ember-owner/get';

import { get } from '@ember/object';

moduleFor('mixin:form-field-options', 'Unit | Mixin | form-field-options', {
  integration: true,

  subject() {
    let component = Component.extend(FormFieldOptionsMixin, {
      componentProperties: {
        fooBar: 'Value for FooBar',
        fizBox: () => 'Value for FizBoz'
      }
    });

    this.register('component:foo-bar-component', component);
    return getOwner(this).lookup('component:foo-bar-component');
  }
});

test('Binds options to the context', function(assert) {
  let component = this.subject();
  component.didReceiveAttrs();

  assert.equal(get(component, 'fooBar'), 'Value for FooBar',
               'Property binded to the context');
  assert.equal(get(component, 'fizBox')(), 'Value for FizBoz',
               'Function binded to the context');
});