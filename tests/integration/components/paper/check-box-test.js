import { module, test } from 'qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | {{paper/check-box}}', function(hooks) {
  setupRenderingTest(hooks);

  test(`renders a checkbox with class check-box`, async function(assert) {
    await render(hbs`{{paper/check-box}}`);
    assert.ok(find('.md-checkbox'));
  });

  test(`has given value`, async function(assert) {
    this.set('selected', true);
    await render(hbs`{{paper/check-box value=selected}}`);
    assert.ok(find('.md-checkbox.md-checked'));
  });

  test(`changing changes value and calls update function`, async function(assert) {
    assert.expect(1);
    this.set('selected', true);
    this.set('update', function(value) {
      assert.notOk(value);
    });

    await render(hbs`{{paper/check-box value=selected updated=update}}`);
    await click(find('.md-checkbox'));
  });
});
