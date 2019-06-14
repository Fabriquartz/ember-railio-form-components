import hbs    from 'htmlbars-inline-precompile';
import run    from 'ember-runloop';
import moment from 'moment';
import $      from 'jquery';

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'date-time-field', 'Integration | Component | {{date-time-field}}',
{
  integration: true,
  beforeEach() {
    this.on('update', function(value) {
      this.set('value', value);
    });
  }
});

test('shows date and time', function(assert) {
  this.set('value', new Date(2015, 0, 1, 12, 30));
  this.render(hbs`{{date-time-field value=value updated=(action "update")}}`);

  let $dateInput = $('.date-picker');
  let $timeInput = $('.time-field');

  assert.equal($dateInput.val(), '01-01-15', 'shows date');
  assert.equal($timeInput.val(), '12:30', 'shows time');

  run(() => {
    $dateInput.val('02-01-15');
    $dateInput.trigger('input');
    $timeInput.val('13:30');
    $timeInput.trigger('input');
  });

  assert.equal(+this.get('value'), +(new Date(2015, 0, 2, 13, 30)),
               'updates date and time');
});

test('set to now', function(assert) {
  this.render(hbs`{{date-time-field value=value updated=(action "update")}}`);
  $('.date-time-field-clock').click();
  assert.equal(moment(this.get('value')).seconds(0).milliseconds(0).toISOString(),
               moment().seconds(0).milliseconds(0).toISOString());
});

test('unset time', function(assert) {
  this.set('value', new Date());
  this.render(hbs`{{date-time-field value=value updated=(action "update")}}`);
  $('.date-time-field-reset').click();
  assert.equal(this.get('value'), null);
});
