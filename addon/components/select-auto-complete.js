import Component from 'ember-component';
import layout from
  'ember-railio-form-components/templates/components/select-auto-complete';

export default Component.extend({
  classNames: ['select-auto-complete'],
  layout,

  _fuzzyMatch(haystack, needle) {
    if (haystack == null || needle == null) {
      return false;
    }

    haystack = haystack.toLowerCase();
    needle   = needle.toLowerCase();

    let n = -1;

    for (let i = 0; i < needle.length; i++) {
      let l = needle[i];
      let m = n;
      n = haystack.indexOf(l, n + 1);

      if (n <= m) {
        return false;
      }
    }

    return true;
  },

  actions: {
    onQueryChange(query) {
      this.sendAction('onQueryChange', query);

      let content    = this.get('content');
      let labelPath  = this.get('optionLabelPath');
      let fuzzyMatch = this._fuzzyMatch;

      if (query == null || content == null) { return content; }

      return content.filter((item) => fuzzyMatch(item.get(labelPath), query));
    }
  }
});
