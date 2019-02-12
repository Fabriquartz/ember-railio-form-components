import { render, find } from '@ember/test-helpers';

import hbs                    from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { module, test }       from 'qunit';

module('Integration | Component | {{paper/file-input}}', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{paper/file-input}}`);
    assert.ok(find('button'), 'shows a button');
    assert.ok(find('button > i.fa.fa-upload'), 'shows default icon in button');
    assert.ok(find('input[type=file]'), 'Has (hidden) file input');
    assert.equal(this.element.textContent.trim(), 'No file selected',
      'shows default message');
  });

  test('sets `accept` attribute on input', async function(assert) {
    this.set('type', 'null');

    await render(hbs`{{paper/file-input type=type}}`);

    let $input = find('input');
    assert.equal($input.getAttribute('accept'), '*/*',
      'accept all files by default');

    this.set('type', 'foobar');
    $input = find('input');

    assert.equal($input.getAttribute('accept'), '*/*',
      'accept all files when type is not a regular file type');

    this.set('type', 'image');
    assert.equal($input.getAttribute('accept'), 'image/*',
      'accept all image files when type is image');

    this.set('type', 'video');
    assert.equal($input.getAttribute('accept'), 'video/*',
      'accept all video files when type is video');

    this.set('type', 'audio');
    assert.equal($input.getAttribute('accept'), 'audio/*',
      'accept all audio files when type is audio');
  });

  test('accept attribute on input is overridden by component attribute',
  async function(assert) {
    this.set('type', 'image');
    this.set('accept', '.foo');

    await render(hbs`{{paper/file-input type=type accept=accept}}`);
    assert.equal(find('input').getAttribute('accept'), '.foo',
      'accept attribute is overridden by component attribute');
  });

  test('shows `clear` button', async function(assert) {
    this.set('fileCount', 0);
    await render(hbs`{{paper/file-input fileCount=fileCount}}`);
    assert.notOk(find('.file-input__clear'),
      'shows no `clear` button when no files are selected');

    this.set('fileCount', 1);
    assert.ok(find('.file-input__clear'),
      'shows `clear` button when files are selected');
  });

  test('shows file names', async function(assert) {
    this.set('fileNames', ['foo.bar', 'baz.bar']);
    this.set('fileCount', 0);
    await render(hbs`{{paper/file-input fileCount=fileCount fileNames=fileNames}}`);

    assert.notOk(find('.file-input__file-names'),
     'shows no file names when no files are selected');

    this.set('fileCount', 1);

    let $fileNames = find('.file-input__file-names').querySelectorAll('li');

    assert.equal($fileNames.length, 2, 'list of file names shows 2 items');
    assert.equal($fileNames[0].textContent.trim(), 'foo.bar',
      'shows first file name');
    assert.equal($fileNames[1].textContent.trim(), 'baz.bar',
      'shows second file name');
  });

  test('shows number of files', async function(assert) {
    this.set('fileCount', 0);

    await render(hbs`{{paper/file-input fileCount=fileCount multiple=true}}`);
    let $fileCount = find('.file-input__file-count');

    assert.notOk($fileCount, 'shows no count when no files are selected');

    this.set('fileCount', 1);
    $fileCount = find('.file-input__file-count');
    assert.equal($fileCount.textContent.trim(), '1 file selected',
      'Shows singular name when one file is selected');

    this.set('fileCount', 2);
    assert.equal($fileCount.textContent.trim(), '2 files selected',
      'Shows plural name when multiple files are selected');
  });

  test('labels are showing given type', async function(assert) {
    this.set('fileCount', 0);
    this.set('multiple', false);
    this.set('type', 'image');

    await render(hbs`{{paper/file-input fileCount=fileCount
                                  multiple=multiple
                                  type=type}}`);

    assert.equal(find('.file-input__no-files').textContent.trim(),
      'No image selected',
      'Empty input label shows given type (multiple=false)');

    this.set('fileCount', 1);

    assert.equal(find('.file-input__file-count').textContent.trim(),
      'image selected',
      'Selected files label shows given type (multiple=false)');

    this.set('fileCount', 0);
    this.set('multiple', true);

    assert.equal(find('.file-input__no-files').textContent.trim(),
      'No images selected',
      'Empty input label shows given type (multiple=true)');

    this.set('fileCount', 1);

    assert.equal(find('.file-input__file-count').textContent.trim(),
      '1 image selected',
      'Selected files label shows given type singularized (multiple=true)');

    this.set('fileCount', 2);

    assert.equal(find('.file-input__file-count').textContent.trim(),
      '2 images selected',
      'Selected files label shows given type pluralized (multiple=true)');

  });
});
