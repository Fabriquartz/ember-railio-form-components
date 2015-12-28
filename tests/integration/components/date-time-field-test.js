import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { get, set, run } = Ember;

moduleForComponent('date-time-field', 'Integration | Component | {{date-time-field}}', {

  integration: true,
  beforeEach: function() {
    this.on('update', function(value) {
      this.set('value', value);
    });
  }
});

test('Has date input and time input', function(assert) {
  this.render(hbs`{{date-time-field}}`);
  assert.equal(this.$('input').length, 2,
              'There should be 2 input elements.');
});

test('Renders date and time in inputs', function(assert) {
  set(this, 'datetime', new Date(2015, 0, 1, 12, 30));

  this.render(hbs`{{date-time-field value=datetime}}`);

  assert.equal(this.$('input[type="date"]:eq(0)').val(), '2015-01-01');
  assert.equal(this.$('input[type="time"]:eq(0)').val(), '12:30');
});

test('Changes value after changing input', function(assert) {
  set(this, 'datetime', new Date(2015, 0, 1, 12, 30));

  this.on('update', function(value) {
    set(this, 'datetime', value);
  });

  this.render(hbs`{{date-time-field value=datetime updated=(action 'update')}}`);

  const $dateInput = this.$('input[type="date"]:eq(0)');

  run(() => {
    $dateInput.val('2015-01-02');
    $dateInput.trigger('change');
  });

  assert.equal(+get(this, 'datetime'), +(new Date(2015, 0, 2, 12, 30)),
               'updates date');

  const $timeInput = this.$('input[type="time"]:eq(0)');

  run(() => {
    $timeInput.val('13:13');
    $timeInput.trigger('change');
  });

  assert.equal(+get(this, 'datetime'), +(new Date(2015, 0, 2, 13, 13)),
               'updates time');
});

test('set to now', function(assert) {
  this.render(hbs`{{date-time-field value=value updated=(action "update")}}`);
  this.$('.date-time-field-clock').click();
  assert.inDelta(+this.get('value'), +(new Date()), 1000);
});

test('unset time', function(assert) {
  this.set('value', new Date());
  this.render(hbs`{{date-time-field value=value updated=(action "update")}}`);
  this.$('.date-time-field-reset').click();
  assert.equal(this.get('value'), null);
});
