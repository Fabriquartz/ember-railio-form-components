import { layout, classNames }         from '@ember-decorators/component';
import { A }                          from '@ember/array';
import Component                      from '@ember/component';
import { action, computed, get, set } from '@ember/object';

import formFieldOptions               from '../../mixins/form-field-options';
import template                       from '../../templates/components/paper/file-input';

export default
@layout(template)
@classNames('file-input')
class PaperFileInput extends Component.extend(formFieldOptions) {
  type = 'file';
  multiple = false;
  iconComponent = 'fa-icon';
  iconName = 'upload';

  fileCount = 0;

  @computed('type')
  get accept() {
    let type = get(this, 'type');
    if (['image', 'video', 'audio'].includes(type)) {
      return `${type}/*`;
    }
    return '*/*';
  }

  @action
  triggerInput() {
    this.element.querySelector('input').click();
  }

  @action
  clear() {
    let input   = this.element.querySelector('input');
    input.value = null;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  @action
  change() {
    let button   = this.element.querySelector('button');
    let fileList = this.element.querySelector('input').files;
    let files    = A();

    button.blur();

    for (let file of fileList) {
      files.pushObject(file);
    }

    set(this, 'fileNames', files.mapBy('name'));
    set(this, 'fileCount', files.length);
    this.updated(files);
  }
}
