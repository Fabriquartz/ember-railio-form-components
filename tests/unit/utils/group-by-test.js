import groupBy          from 'dummy/utils/group-by';
import { module, test } from 'qunit';

module('Unit | Utility | groupBy()', function() {
  test('when no group passed, return content', function(assert) {
    let list   = [1, 2, 3];
    let result = groupBy(list);

    assert.equal(result, list);
  });

  test('group content by groupPath', function(assert) {
    let list                                = [
      { id: 1, parent: 'A' },
      { id: 2, parent: 'C' },
      { id: 3, parent: 'B' },
      { id: 4, parent: 'C' },
      { id: 5, parent: 'A' }
    ];
    let [item1, item2, item3, item4, item5] = list;
    let result                              = groupBy(list, 'parent');

    assert.equal(result.length, 3, 'creates 3 groups based on the groupPath');
    assert.equal(result[0].groupName, 'A', 'group A has groupName');
    assert.equal(result[1].groupName, 'C', 'group C has groupName');
    assert.equal(result[2].groupName, 'B', 'group B has groupName');

    assert.deepEqual(
      result[0].options,
      [item1, item5],
      'group A has correct items in options'
    );
    assert.deepEqual(
      result[1].options,
      [item2, item4],
      'group C has correct items in options'
    );
    assert.deepEqual(result[2].options, [item3], 'group B has correct items in options');
  });

  test('include objects without a groupPath value', function(assert) {
    let list        = [
      { id: 1, parent: 'A' },
      { id: 2, parent: 'B' },
      { id: 3 },
      { id: 4, parent: 'B' }
    ];
    let [, , item3] = list;
    let result      = groupBy(list, 'parent');

    assert.equal(result.length, 3, 'creates 2 groups and a single object');
    assert.equal(result[0].groupName, 'A', 'group A has groupName');
    assert.equal(result[1].groupName, 'B', 'group B has groupName');
    assert.equal(result[2], item3, 'single object directly into array');
  });
});
