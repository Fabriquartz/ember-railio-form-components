import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/auto-complete';
import PropertyPathMixin from 'ember-railio-form-components/mixins/property-path-mixin';

import {
  proxyIndexOf as indexOf
} from 'ember-proxy-util';

const { Binding, computed, observer, run } = Ember;

const get = Ember.get;

export default Ember.Component.extend(PropertyPathMixin, {
  classNames: ['auto-complete'],
  propertyTarget: 'selection',
  layout:     layout,

  attributeBindings: ['searchQuery:title'],

  init() {
    this._setupValue();
    this._super.apply(this, arguments);
  },

  _setupValue: observer('optionLabelPath', function() {
    let labelPathBinding = this.get('labelPathBinding');
    const labelPath = this.get('optionLabelPath');

    if (labelPathBinding != null && typeof labelPathBinding.disconnect === 'function') {
      labelPathBinding.disconnect(this);
    }

    if (typeof labelPath === 'string') {
      labelPathBinding = Binding.from(`selection.${labelPath}`).to('selectionLabel');
      labelPathBinding.connect(this);
    }

    this.set('labelPathBinding', labelPathBinding);
  }),

  value: computed('selectionLabel', '_searchTerm', {
    get() {
      return this.get('_searchTerm') || this.get('selectionLabel');
    },

    set(key, value) {
      this.sendAction('onQueryChange', value);

      this.set('_searchTerm', value);
      this.set('selection', null);

      return this.get('value');
    }
  }),

  groupedContent: computed('content.@each', function() {
    const groups = Ember.A();
    this.get('content').forEach((item) => {
      const groupPath = this.get('groupLabelPath');
      const label     = item.getWithDefault(groupPath, '(unknown)');
      let   group     = groups.findBy('label', label);

      if (group == null) {
        group = Ember.Object.create({
          label:   label,
          content: Ember.A()
        });

        groups.pushObject(group);
      }

      group.get('content').pushObject(item);
    });

    return groups;
  }),

  keyDown(e) {
    if (e.keyCode === 40) {
      this.send('selectDown');
    } else if (e.keyCode === 38) {
      this.send('selectUp');
    }
  },

  actions: {
    showList() {
      this.$('.auto-complete__option-list').slideDown();
    },

    hideList() {
      this.set('_searchTerm', null);
      run.once(() => {
        this.$('.auto-complete__option-list').slideUp();
      });
    },

    selectItem(item) {
      this.set('selection', item);
      this.sendAction('onSelect', item);
    },

    selectUp() {
      const content    = this.get('content');
      const selection  = this.get('selection');
      let currentIndex = indexOf(content, selection);

      if (currentIndex < 0) {
        currentIndex = 1;
      }

      if (currentIndex > 0) {
        this.send('selectItem', content[(currentIndex - 1)]);
      }
    },

    selectDown() {
      const content      = this.get('content');
      const selection    = this.get('selection');
      const currentIndex = indexOf(content, selection);

      if (currentIndex < get(content, 'length') - 1) {
        this.send('selectItem', content[(currentIndex + 1)]);
      }
    },

    acceptSelection() {
      const selection = this.get('selection');

      if (this.get('content').indexOf(selection) === -1 || selection == null) {
        this.send('selectItem', this.get('content')[0]);
      }
      this.send('hideList');
    },

    emptySelection() {
      this.send('selectItem', null);
      this.send('hideList');
    }
  }
});
