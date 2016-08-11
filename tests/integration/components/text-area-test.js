import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { percySnapshot } from 'ember-percy';

const { run } = Ember;

moduleForComponent('text-area', 'Integration | Component | {{text-area}}', {
  integration: true
});

test('renders a text-area with value', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-area value=value}}`);

  const $area = this.$('textarea.text-area');
  assert.equal($area.length, 1, 'renders a textarea with class text-area');

  assert.equal($area.val(), 'testing');

  percySnapshot('{{text-area}}');
});

test(`typing doesn't change value but sends updated`, function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-area value=value updated=(action "update")}}`);

  const $input = this.$('.text-area');

  run(() => {
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), '');
});

test('works with form-field', function(assert) {
  assert.expect(5);

  const person = Ember.Object.create({
    name: 'John White'
  });

  this.set('object', person);

  this.on('update', function(object, propertyPath, value) {
    assert.equal(object, person, 'update function gets the right object');
    assert.equal(propertyPath, 'name', 'update function gets the right propertyPath');
    assert.equal(value, 'John Black', 'update function gets the new value');
  });

  this.render(hbs`
    {{form-field type="text-area"
                 object=object
                 propertyPath="name"
                 updated=(action "update")}}`);

  const $textarea = this.$('.form-field').find('textarea.text-area');

  run(() => {
    $textarea.val('John Black');
    $textarea.trigger('input');
  });

  assert.equal($textarea.val(), 'John Black', 'changes the input value');
  assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
});
