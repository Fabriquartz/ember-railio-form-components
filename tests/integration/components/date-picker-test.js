import { run }                from '@ember/runloop';
import { render, settled }    from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs                    from 'htmlbars-inline-precompile';
import $                      from 'jquery';
import { module, test }       from 'qunit';

module('Integration | Component | {{date-picker}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send    = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.set('value', new Date(2018, 9, 10, 0, 0));
    this.actions.update = function(value) {
      this.set('value', value);
    };
  });

  function fillIn(input, value) {
    run(() => {
      input.trigger('focusin');
      input.val(value);
      input.trigger('input');
      input.trigger('focusout');
    });
  }

  function arrowKey(input, upOrDown, shift = false) {
    let keyCode = upOrDown === 'up' ? 38 : 40;

    run(() => {
      input.trigger('focusin');
      input.trigger($.Event('keydown', { keyCode, shiftKey: shift }));
    });
  }
  function arrowUp(input, shift) {
    arrowKey(input, 'up', shift);
  }
  function arrowDown(input, shift) {
    arrowKey(input, 'down', shift);
  }

  test('date gets formatted to date string', async function(assert) {
    this.set('value', new Date(2015, 0, 1));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');
    assert.equal($input.val(), '01-01-15');
  });

  test('null is an option', async function(assert) {
    await render(hbs`{{date-picker value=value}}`);

    let $input = this.$('input');
    fillIn($input, null);

    assert.equal($input.val(), '');
  });

  test('filling in a date works', async function(assert) {
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    fillIn($input, '05-05-15');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));
  });

  test('typing in an empty value', async function(assert) {
    this.set('value', new Date(2015, 0, 1));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    fillIn($input, '');

    assert.equal($input.val(), '');
    assert.equal(this.get('value'), null);
  });

  test('typing in date shorthands', async function(assert) {
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input  = this.$('input');
    let year    = new Date().getFullYear();
    let yearStr = year.toString().slice(-2);
    let month   = `0${new Date().getMonth() + 1}`.substr(-2);

    fillIn($input, '050515');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));

    fillIn($input, '150515');

    assert.equal($input.val(), '15-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 15));

    fillIn($input, '50515');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));

    fillIn($input, '1505');

    assert.equal($input.val(), `15-05-${yearStr}`);
    assert.equal(+this.get('value'), +new Date(year, 4, 15));

    fillIn($input, '505');

    assert.equal($input.val(), `05-05-${yearStr}`);
    assert.equal(+this.get('value'), +new Date(year, 4, 5));

    fillIn($input, '4');

    assert.equal($input.val(), `04-${month}-${yearStr}`);
    assert.equal(+this.get('value'), +new Date(year, month - 1, 4));
  });

  test('typing in with different separators', async function(assert) {
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    fillIn($input, '05;05;15');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));

    fillIn($input, '06/05/15');

    assert.equal($input.val(), '06-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 6));

    fillIn($input, '05\\05\\15');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));

    fillIn($input, '06,05,15');

    assert.equal($input.val(), '06-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 6));

    fillIn($input, '05.05.15');

    assert.equal($input.val(), '05-05-15');
    assert.equal(+this.get('value'), +new Date(2015, 4, 5));
  });

  test('arrow up increases date by one day', async function(assert) {
    this.set('value', new Date(2015, 0, 1));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    arrowUp($input);

    assert.equal($input.val(), '02-01-15');
    assert.equal(+this.get('value'), +new Date(2015, 0, 2));

    this.set('value', new Date(2015, 0, 31));

    arrowUp($input);

    assert.equal($input.val(), '01-02-15');
    assert.equal(+this.get('value'), +new Date(2015, 1, 1));

    return settled();
  });

  test('shift + arrow up increases date by one month', async function(assert) {
    this.set('value', new Date(2015, 0));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    arrowUp($input, true);

    assert.equal($input.val(), '01-02-15');
    assert.equal(+this.get('value'), +new Date(2015, 1, 1));

    this.set('value', new Date(2015, 11));

    arrowUp($input, true);

    assert.equal($input.val(), '01-01-16');
    assert.equal(+this.get('value'), +new Date(2016, 0, 1));

    return settled();
  });

  test('arrow down decreases date by one day', async function(assert) {
    this.set('value', new Date(2015, 0, 2));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    arrowDown($input);

    assert.equal($input.val(), '01-01-15');
    assert.equal(+this.get('value'), +new Date(2015, 0, 1));

    this.set('value', new Date(2015, 1, 1));

    arrowDown($input);

    assert.equal($input.val(), '31-01-15');
    assert.equal(+this.get('value'), +new Date(2015, 0, 31));

    return settled();
  });

  test('shift + arrow month decreases date by one month', async function(assert) {
    this.set('value', new Date(2015, 1));
    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    let $input = this.$('input');

    arrowDown($input, true);

    assert.equal($input.val(), '01-01-15');
    assert.equal(+this.get('value'), +new Date(2015, 0));

    this.set('value', new Date(2015, 0));

    arrowDown($input, true);

    assert.equal($input.val(), '01-12-14');
    assert.equal(+this.get('value'), +new Date(2014, 11));

    return settled();
  });

  test('Does not lose time after change the date', async function(assert) {
    this.set('value', new Date(2018, 11, 5, 14, 57));

    await render(hbs`{{date-picker value=value updated=(action "update")}}`);

    fillIn(this.$('input'), '1-12-2018');

    assert.equal(+this.get('value'), +new Date(2018, 11, 1, 14, 57));
  });
});
