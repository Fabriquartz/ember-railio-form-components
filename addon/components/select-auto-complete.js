import Ember from 'ember';
import layout from 'ember-railio-form-components/templates/components/select-auto-complete';

export default Ember.Component.extend({
  classNames: ['select-auto-complete'],

  layout: layout,

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
    onQueryChange: function(query) {
      this.sendAction('onQueryChange', query);

      const content    = this.get('content');
      const labelPath  = this.get('optionLabelPath');
      const fuzzyMatch = this._fuzzyMatch;

      if (query == null || content == null) { return content; }

      return content.filter((item) => fuzzyMatch(item.get(labelPath), query));
    }
  }
});
