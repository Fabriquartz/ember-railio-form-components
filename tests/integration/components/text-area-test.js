import { moduleForComponent, test } from 'ember-qunit';
import EmberObject from 'ember-object';

import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('text-area', 'Integration | Component | {{text-area}}', {
  integration: true
});

test('renders a text-area with value', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-area value=value}}`);

  let $area = this.$('textarea.text-area');
  assert.equal($area.length, 1, 'renders a textarea with class text-area');

  assert.equal($area.val(), 'testing');
});

test('Sizes with input', function(assert) {
  this.set('value', 'First line of text.');
  this.render(hbs`{{text-area value=value
                              sizeOnInput=true}}`);

  let $area  = this.$('textarea.text-area').attr('style', 'width: 150px');
  let $input = this.$('.text-area');

  assert.equal($area.height(), 26, 'First line');

  run(() => {
    let val = $input.val();
    $input.val(`${val} This is the second line of text`);
    $input.trigger('input');
  });

  assert.equal($area.height(), 30, 'Height for two lines of text');

  run(() => {
    let val = $input.val();
    $input.val(`${val} Last but not least, the third line of text`);
    $input.trigger('input');
  });

  assert.equal($area.height(), 56, 'Height for three line of text');
});

test(`typing doesn't change value but sends updated`, function(assert) {
  assert.expect(2);

  this.set('value', '');
  this.on('update', function(value) {
    assert.equal(value, 'x', 'calls update function with new value');
  });

  this.render(hbs`{{text-area value=value updated=(action "update")}}`);

  let $input = this.$('.text-area');

  run(() => {
    $input.val('x');
    $input.trigger('input');
  });

  assert.equal(this.get('value'), '');
});

test('works with form-field', function(assert) {
  assert.expect(5);

  let person = EmberObject.create({
    name: 'John White'
  });

  this.set('object', person);

  this.on('update', function(object, propertyPath, value) {
    assert.equal(object, person, 'update function gets right object');
    assert.equal(propertyPath, 'name', 'update function gets right propertyPath');
    assert.equal(value, 'John Black', 'update function gets new value');
  });

  this.render(hbs`
    {{form-field type="text-area"
                 object=object
                 propertyPath="name"
                 updated=(action "update")}}`);

  let $textarea = this.$('.form-field').find('textarea.text-area');

  run(() => {
    $textarea.val('John Black');
    $textarea.trigger('input');
  });

  assert.equal($textarea.val(), 'John Black', 'changes the input value');
  assert.equal(this.get('object.name'), 'John White', `doesn't update object value`);
});
