import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('text-area', 'Integration | Component | {{text-area}}', {
  integration: true
});

test('renders a text-area with value', function(assert) {
  this.set('value', 'testing');
  this.render(hbs`{{text-area value=value}}`);

  const $area = this.$('textarea.text-area');
  assert.equal($area.length, 1, 'renders a textarea with class text-area');

  assert.equal($area.val(), 'testing');
});
