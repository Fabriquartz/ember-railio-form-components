import Component from 'ember-component';
import run       from 'ember-runloop';
import service   from 'ember-service/inject';

import formFieldOptions from
  'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  store: service('store'),

  lookupModel(query) {
    let rQuery    = new RegExp(query, 'i');
    let modelName = this.get('modelName');
    let labelPath = this.get('optionLabelPath');
    let queryKey  = this.get('queryKey');
    let params    = this.get('params');

    if (params == null || typeof params !== 'object') { params = {}; }
    if (query == null || query === '') { return; }

    if (typeof queryKey === 'string') {
      params[`by_${queryKey.underscore()}`] = query;
    }

    let dataSet = this.get('store').filter(modelName, params, function(model) {
      return model.get(labelPath).match(rQuery);
    });

    this.set('dataSet', dataSet);
  },

  actions: {
    onQueryChange(query) {
      run.debounce(this, this.lookupModel, query, 500);
    }
  }
});
