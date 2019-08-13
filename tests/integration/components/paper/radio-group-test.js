import { module, test }           from 'qunit';
import { render, findAll, click } from '@ember/test-helpers';
import hbs                        from 'htmlbars-inline-precompile';
import { setupRenderingTest }     from 'ember-qunit';

module('Integration | Component | {{paper/radio-group}}', function(hooks) {
  setupRenderingTest(hooks);

  test('shows options', async function(assert) {
    this.set('options', ['Option 1', 'Option 2']);
    this.set('selection', null);

    await render(hbs`{{paper/radio-group value=selection options=options}}`);

    let $options = findAll('md-radio-button');

    assert.equal($options.length, 2, 'shows all options');
    assert.equal($options[0].textContent.trim(), 'Option 1', 'shows option 1 value');
    assert.equal($options[1].textContent.trim(), 'Option 2', 'shows option 2 value');
  });

  test('value selected', async function(assert) {
    let options = this.set('options', ['Option 1', 'Option 2']);
    this.set('selectedOption', options[1]);

    await render(hbs`{{paper/radio-group selectedOption=selectedOption
                                         options=options}}`);

    let $selectedOption = findAll('md-radio-button.md-checked');
    assert.equal($selectedOption.length, 1);
    assert.equal($selectedOption[0].textContent.trim(), 'Option 2');
  });

  test('select value calls updated action', async function(assert) {
    assert.expect(1);

    let options = this.set('options', ['Option 1', 'Option 2', 'Option 3']);

    this.set('selection', null);

    this.set('updated', function(value) {
      assert.equal(value, options[1], 'calls update action with clicked value');
    });

    await render(hbs`{{paper/radio-group value=selection
                                         options=options
                                         updated=updated}}`);

    click(findAll('md-radio-button')[1]);
  });

  test('shows optionLabel and selects optionValue', async function(assert) {
    assert.expect(2);
    let firstValue  = { label: 'Option 1', value: 'Value 1' };
    let secondValue = { label: 'Option 2', value: 'Value 2' };

    this.set('options', [firstValue, secondValue]);
    this.set('selection', null);

    this.set('updated', function(value) {
      assert.equal(value, 'Value 2', 'calls update action with clicked value');
    });

    await render(hbs`{{paper/radio-group value=selection
                                         options=options
                                         labelPropertyPath="label"
                                         valuePropertyPath="value"
                                         updated=updated}}`);

    assert.equal(
      findAll('md-radio-button')[1].textContent.trim(),
      'Option 2',
      'shows option 2 label'
    );

    click(findAll('md-radio-button')[1]);
  });
});
