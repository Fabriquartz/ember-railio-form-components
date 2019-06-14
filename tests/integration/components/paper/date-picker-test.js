import hbs                        from 'htmlbars-inline-precompile';
import { module, test }           from 'qunit';
import { render, find, focus,
  fillIn, blur, triggerKeyEvent } from '@ember/test-helpers';
import { setupRenderingTest }     from 'ember-qunit';

import $ from 'jquery';

module('Integration | Component | {{paper/date-picker}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('value', new Date(2018, 9, 10, 0, 0));
    this.actions = {
      update: (value) => { this.set('value', value); }
    };
  });

  test('date gets formatted to date string', async function(assert) {
    this.set('value', new Date(2015, 0, 28));
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);
    let $input = find('input');
    assert.equal($input.value, '28-01-15');
  });

  test('Filling in an empty value', async function(assert) {
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    let $input = find('input');

    await focus($input);
    await fillIn($input, '');
    await blur($input);

    assert.equal(find('input').value, '');
    assert.equal(this.get('value'), null);
  });

  test('filling in a date works', async function(assert) {
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    let $input = find('input');

    await focus($input);
    await fillIn(find('input'), '23-05-15');
    await blur('input');

    assert.equal(find('input').value, '23-05-15');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 23)));
  });

  test('Filling in date shorthands', async function(assert) {
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    let $input  = find('input');
    let year    = (new Date()).getFullYear();
    let yearStr = year.toString().slice(-2);
    let month   = `0${(new Date()).getMonth() + 1}`.substr(-2);

    await focus($input);
    await fillIn($input, '23052015');
    await blur($input);

    assert.equal($input.value, '23-05-15',
                 'Formats 8-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 23)),
                 'Formats 8-digit shorthand to date');

    await focus($input);
    await fillIn($input, '150515');
    await blur($input);

    assert.equal($input.value, '15-05-15',
                 'Formats 6-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 15)),
                 'Formats 6-digit shorthand to date');

    await focus($input);
    await fillIn($input, '90515');
    await blur($input);

    assert.equal($input.value, '09-05-15',
                 'Formats 5-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 9)),
                 'Formats 5-digit shorthand to date');

    await focus($input);
    await fillIn($input, '2305');
    await blur($input);

    assert.equal($input.value, `23-05-${yearStr}`,
                 'Formats 4-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(year, 4, 23)),
                 'Formats 4-digit shorthand to date');

    await focus($input);
    await fillIn($input, '705');
    await blur($input);

    assert.equal($input.value, `07-05-${yearStr}`,
                 'Formats 3-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(year, 4, 7)),
                 'Formats 3-digit shorthand to date');

    await focus($input);
    await fillIn($input, '4');
    await blur($input);

    assert.equal($input.value, `04-${month}-${yearStr}`,
                 'Formats 1-digit shorthand to date string');
    assert.equal(+this.get('value'), +(new Date(year, month - 1, 4)),
                 'Formats 1-digit shorthand to date');
  });

  test('Filling in with different separators', async function(assert) {
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    let $input = find('input');

    await focus($input);
    await fillIn($input, '07;05;15');
    await blur($input);

    assert.equal($input.value, '07-05-15',
                 'Format date string that contains ;');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 7)),
                 'Can format date string with ; to date');

    await focus($input);
    await fillIn($input, '06/05/15');
    await blur($input);

    assert.equal($input.value, '06-05-15',
                 'Format date string that contains /');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 6)),
                 'Can format date string with / to date');

    await focus($input);
    await fillIn($input, '07\\05\\15');
    await blur($input);

    assert.equal($input.value, '07-05-15',
                 'Format date string that contains \\');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 7)),
                 'Can format date string with \\ to date');

    await focus($input);
    await fillIn($input, '06,05,15');
    await blur($input);

    assert.equal($input.value, '06-05-15',
                 'Format date string that contains ,');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 6)),
                 'Can format date string with , to date');

    await focus($input);
    await fillIn($input, '07.05.15');
    await blur($input);

    assert.equal($input.value, '07-05-15',
                 'Format date string that contains .');
    assert.equal(+this.get('value'), +(new Date(2015, 4, 7)),
                 'Can format date string with . to date');
  });

  test('arrow up increases date by one day', async function(assert) {
    this.set('value', new Date(2015, 0, 1));
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    await triggerKeyEvent('input', 'keydown', 38);

    assert.equal(find('input').value, '02-01-15');
    assert.equal(+this.get('value'), +(new Date(2015, 0, 2)));

    this.set('value', new Date(2015, 0, 31));

    await triggerKeyEvent('input', 'keydown', 38);

    assert.equal(find('input').value, '01-02-15');
    assert.equal(+this.get('value'), +(new Date(2015, 1, 1)));
  });

  test('shift + arrow up increases date by one month', async function(assert) {
    this.set('value', new Date(2015, 0));
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    let $input = $('input');

    await triggerKeyEvent('input', 'keydown', 38, { shiftKey: true });

    assert.equal($input.val(), '01-02-15');
    assert.equal(+this.get('value'), +(new Date(2015, 1, 1)));

    this.set('value', new Date(2015, 11));

    await triggerKeyEvent('input', 'keydown', 38, { shiftKey: true });

    assert.equal($input.val(), '01-01-16');
    assert.equal(+this.get('value'), +(new Date(2016, 0, 1)));
  });

  test('arrow down decreases date by one day', async function(assert) {
    this.set('value', new Date(2015, 0, 2));
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    await triggerKeyEvent('input', 'keydown', 40);

    assert.equal(find('input').value, '01-01-15');
    assert.equal(+this.get('value'), +(new Date(2015, 0, 1)));

    this.set('value', new Date(2015, 1, 1));

    await triggerKeyEvent('input', 'keydown', 40);

    assert.equal(find('input').value, '31-01-15');
    assert.equal(+this.get('value'), +(new Date(2015, 0, 31)));
  });

  test('shift + arrow month decreases date by one month', async function(assert) {
    this.set('value', new Date(2015, 1));
    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    await triggerKeyEvent('input', 'keydown', 40, { shiftKey: true });

    assert.equal(find('input').value, '01-01-15');
    assert.equal(+this.get('value'), +(new Date(2015, 0)));

    this.set('value', new Date(2015, 0));

    await triggerKeyEvent('input', 'keydown', 40, { shiftKey: true });

    assert.equal(find('input').value, '01-12-14');
    assert.equal(+this.get('value'), +(new Date(2014, 11)));
  });

  test('Does not lose time after change the date', async function(assert) {
    this.set('value', new Date(2018, 11, 5, 14, 57));

    await render(hbs`{{paper/date-picker value=value updated=(action "update")}}`);

    await focus('input');
    await fillIn('input', '1-12-2018');
    await blur('input');

    assert.equal(+this.get('value'), +(new Date(2018, 11, 1, 14, 57)));
  });
});
