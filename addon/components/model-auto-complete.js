import Component from '@ember/component';
import { run } from '@ember/runloop';
import layout from '../templates/components/model-auto-complete';
import { inject as service } from '@ember/service';

import formFieldOptions from 'ember-railio-form-components/mixins/form-field-options';

export default Component.extend(formFieldOptions, {
  layout,
  store: service('store'),

  lookupModel(query) {
    let rQuery = new RegExp(query, 'i');
    let modelName = this.modelName;
    let labelPath = this.optionLabelPath;
    let queryKey = this.queryKey;
    let params = this.params;

    if (params == null || typeof params !== 'object') {
      params = {};
    }
    if (query == null || query === '') {
      return;
    }

    if (typeof queryKey === 'string') {
      params[`by_${queryKey.underscore()}`] = query;
    }

    let dataSet = this.store.filter(modelName, params, function (model) {
      return model.get(labelPath).match(rQuery);
    });

    this.set('dataSet', dataSet);
  },

  actions: {
    onQueryChange(query) {
      run.debounce(this, this.lookupModel, query, 500);
    },
  },
});
