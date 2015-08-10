import Ember from 'ember';

const { run } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service('store'),

  lookupModel: function(query) {
    let rQuery    = new RegExp(query, 'i');
    let modelName = this.get('modelName');
    let labelPath = this.get('optionLabelPath');
    let queryKey  = this.get('queryKey');
    let params    = this.get('params');

    if (params == null || typeof params !== 'object') { params = {}; }
    if (query == null || query === '') { return; }

    if (typeof queryKey === 'string') {
      params['by_' + queryKey.underscore()] = query;
    }

    let dataSet = this.get('store').filter(modelName, params, function(model) {
      return model.get(labelPath).match(rQuery);
    });

    this.set('dataSet', dataSet);
  },

  actions: {
    onQueryChange: function(query) {
      run.debounce(this, this.lookupModel, query, 500);
    }
  }
});
