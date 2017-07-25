import { moduleForComponent, test } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('check-box', 'Integration | Component | {{check-box}}', {
  integration: true,
  beforeEach() {
    this.on('update', function(object, propertyPath, value) {
      object.set(propertyPath, value);
    });
  }
});

test(`renders a checkbox with class check-box`, function(assert) {
  this.render(hbs`{{check-box}}`);

  let $checkbox = this.$('input.check-box[type="checkbox"]');
  assert.equal($checkbox.length, 1);
});

test(`has given value`, function(assert) {
  this.set('selected', true);
  this.render(hbs`{{check-box value=selected}}`);

  let [$checkbox] = this.$('.check-box');
  assert.equal($checkbox.checked, true, 'is checked');
});

test(`changing changes value and calls update function`, function(assert) {
  assert.expect(3);
  this.set('selected', true);
  this.on('update', function(value) {
    assert.equal(value, false, 'calls update function with new value');
    this.set('selected', value);
  });

  this.render(hbs`{{check-box value=selected updated=(action "update")}}`);

  let $checkbox = this.$('.check-box');

  run(() => {
    $checkbox.trigger('click');
  });
  assert.equal($checkbox[0].checked, false, 'got unchecked');
  assert.equal(this.get('selected'), false, 'value changed');
});
