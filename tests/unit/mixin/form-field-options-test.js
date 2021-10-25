import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import FormFieldOptionsMixin from 'ember-railio-form-components/mixins/form-field-options';

import Component from '@ember/component';

import { get } from '@ember/object';

module('Unit | Mixin | form-field-options', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.subject = function () {
      let component = Component.extend(FormFieldOptionsMixin, {
        componentProperties: {
          fooBar: 'Value for FooBar',
          fizBox: () => 'Value for FizBoz',
        },
      });

      this.owner.register('component:foo-bar-component', component);
      return this.owner.lookup('component:foo-bar-component');
    };
  });

  test('Binds options to the context', function (assert) {
    let component = this.subject();
    component.didReceiveAttrs();

    assert.equal(
      component.fooBar,
      'Value for FooBar',
      'Property binded to the context'
    );
    assert.equal(
      component.fizBox(),
      'Value for FizBoz',
      'Function binded to the context'
    );
  });
});
