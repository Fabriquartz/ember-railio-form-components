import { A }                  from '@ember/array';
import Component              from '@ember/component';
import { get, set, computed } from '@ember/object';

import invokeAction from 'ember-invoke-action';

import formFieldOptions from '../../mixins/form-field-options';
import layout           from '../../templates/components/paper/file-input';

export default Component.extend(formFieldOptions, {
  layout,

  classNames: ['file-input'],

  type:          'file',
  multiple:      false,
  iconComponent: 'fa-icon',
  iconName:      'upload',

  fileCount: 0,

  accept: computed('type', function() {
    let type = get(this, 'type');
    if (['image', 'video', 'audio'].includes(type)) {
      return `${type}/*`;
    }
    return '*/*';
  }),

  actions: {
    triggerInput() {
      this.element.querySelector('input').click();
    },

    clear() {
      let input = this.element.querySelector('input');
      input.value = null;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },

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
      invokeAction(this, 'updated', files);
    }
  }
});
