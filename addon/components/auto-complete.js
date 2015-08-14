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
  layout: layout,

  attributeBindings: ['searchQuery:title'],

  init() {
    this._setupValue();
    this._super.apply(this, arguments);
  },

  didInsertElement() {
    this.$('.auto-complete__option-list').on('mousedown', (e) => {
      e.preventDefault();
    });
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

      if (value != null && value !== '') {
        run.next(() => {
          let content = this.get('content');
          if (Ember.isArray(content)) {
            content = Ember.A(content); // need to be an Ember array to use objectAt
            this.send('highlightItem', content.objectAt(0));
            this.send('showList');
          }
        });
      } else if (!this.get('arrowKeyDown')) {
        this.send('selectItem', null);
      }

      return this.get('value');
    }
  }),

  groupedContent: computed('content.[]', function() {
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
      this.set('arrowKeyDown', true);
      this.send('selectDown');
    } else if (e.keyCode === 38) {
      this.set('arrowKeyDown', true);
      this.send('selectUp');
    } else if (e.keyCode === 9) {
      this.send('selectHighlighted');
    }
  },

  keyUp(e) {
    if ([38, 40].indexOf(e.keyCode) !== -1) {
      this.set('arrowKeyDown', false);
    }
  },

  click(e) {
    e.preventDefault();
    console.log('clicked');
  },

  actions: {
    showList() {
      this.$('.auto-complete__option-list').slideDown();
    },

    hideList() {
      this.set('_searchTerm', null);
      this.send('highlightItem', null);
      this.sendAction('onQueryChange', null);
      this.$('.auto-complete__option-list').slideUp();
    },

    selectItem(item) {
      this.send('hideList');
      this.send('highlightItem', null);
      this.set('selection', item);
      this.sendAction('onSelect', item);
    },

    highlightItem(item) {
      this.set('highlighted', item);
    },

    selectUp() {
      this.send('showList');

      let content       = this.get('content');
      const selection   = this.get('selection');
      const highlighted = this.get('highlighted');
      let currentIndex;

      if (Ember.isArray(content)) {
        content = Ember.A(content); // need to be an Ember array to use objectAt

        if (highlighted != null) {
          currentIndex = indexOf(content, highlighted);
        } else {
          currentIndex = indexOf(content, selection);
        }

        if (currentIndex < 0) { currentIndex = 1; }

        if (currentIndex > 0) {
          this.send('highlightItem', content.objectAt((currentIndex - 1)));
        }
      }
    },

    selectDown() {
      this.send('showList');

      let content       = this.get('content');
      const selection   = this.get('selection');
      const highlighted = this.get('highlighted');
      let currentIndex;

      if (Ember.isArray(content)) {
        content = Ember.A(content); // need to be an Ember array to use objectAt

        if (highlighted != null) {
          currentIndex = indexOf(content, highlighted);
        } else {
          currentIndex = indexOf(content, selection);
        }

        if (currentIndex < get(content, 'length') - 1) {
          this.send('highlightItem', content.objectAt((currentIndex + 1)));
        }
      }
    },

    selectHighlighted() {
      const highlighted = this.get('highlighted');

      if (highlighted != null) {
        this.send('selectItem', highlighted);
      }
    },

    acceptSelection() {
      this.send('selectHighlighted');

      const selection = this.get('selection');

      if (selection == null) {
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
