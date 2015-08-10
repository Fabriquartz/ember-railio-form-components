import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/select-auto-complete';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['select-auto-complete'],

  layout: layout,

  filteredContent: computed('content.@each', 'searchQuery', function() {
    const content         = this.get('content');
    const filteredContent = Ember.A();
    const labelPath       = this.get('optionLabelPath');
    const searchQuery     = this.get('searchQuery');
    const fuzzyMatch      = this._fuzzyMatch;

    if (searchQuery == null || content == null) { return content; }

    content.forEach(function(item) {
      const value = item.get(labelPath);

      if (fuzzyMatch(value, searchQuery)) {
        return filteredContent.push(item);
      }
    });

    return filteredContent;
  }),

  _fuzzyMatch: function(haystack, needle) {
    if (haystack == null || needle == null) {
      return false;
    }

    haystack = haystack.toLowerCase();
    needle   = needle.toLowerCase();

    let n = -1;

    for (let i = 0; i < needle.length; i++) {
      const l = needle[i];
      const m = n;
      n = haystack.indexOf(l, n + 1);

      if (n <= m) {
        return false;
      }
    }

    return true;
  },

  actions: {
    onSelect: function(item) {
      return this.sendAction('onSelect', item);
    },
    onQueryChange: function(query) {
      return this.set('searchQuery', query);
    }
  }
});
