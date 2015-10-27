import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/auto-complete';

import {
  proxyIndexOf as indexOf
} from 'ember-proxy-util';

const { computed } = Ember;

const { alias } = computed;

const get = Ember.get;

export default Ember.Component.extend({
  classNames: ['auto-complete'],
  layout: layout,

  attributeBindings: ['searchQuery:title'],
  selection: alias('value'),

  didInsertElement() {
    this.$('.auto-complete__option-list').on('mousedown', (e) => {
      e.preventDefault();
    });

    const $input = this.$('.auto-complete__input');
    $input.on('focusIn click', () => this.send('showList'));
  },

  didReceiveAttrs: function() {
    const value = this.getAttr('value');
    this._updateQueryOnValue(value);
  },

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
    } else if (e.keyCode === 27) {
      this.send('queryChanged', null);
      this.send('hideList');
    }
  },

  click(e) {
    e.preventDefault();
  },

  _updateQueryOnValue(value) {
    const optionLabelPath = this.get('optionLabelPath');

    Ember.RSVP.Promise.resolve(value).then((value) => {
      if (value == null) {
        this.set('query', null);
      } else {
        this.set('query', get(value, optionLabelPath));
      }
    });
  },

  actions: {
    showList() {
      this.$('.auto-complete__option-list').slideDown();
    },

    hideList() {
      this.send('highlightItem', null);
      this.sendAction('onQueryChange', null);
      this.$('.auto-complete__option-list').slideUp();
    },

    selectItem(item) {
      this.send('hideList');
      this.send('highlightItem', null);
      // this.set('selection', item);
      // this.sendAction('onSelect', item);
      this.send('changed', item);
    },

    changed(value) {
      this._updateQueryOnValue(value);

      if (typeof this.attrs.updated === 'function') {
        this.attrs.updated(value);
      }
    },

    queryChanged(value) {
      if (value != null && value !== '') {
        let content = this.get('content');
        if (Ember.isArray(content)) {
          content = Ember.A(content); // need to be an Ember array to use objectAt
          this.send('highlightItem', content.objectAt(0));
          this.send('showList');
        }
      } else if (!this.get('arrowKeyDown')) {
        value = null;
      }

      this.set('query', value);

      if (typeof this.attrs.onQueryChange === 'function') {
        this.attrs.onQueryChange(value);
      }
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
