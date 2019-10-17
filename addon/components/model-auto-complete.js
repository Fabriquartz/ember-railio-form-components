import { layout }            from '@ember-decorators/component';
import Component             from '@ember/component';
import { action }            from '@ember/object';
import { run }               from '@ember/runloop';
import { inject as service } from '@ember/service';
import formFieldOptions      from 'ember-railio-form-components/mixins/form-field-options';

import template              from '../templates/components/model-auto-complete';

export default
@layout(template)
class ModelAutoComplete extends Component.extend(formFieldOptions) {
  @service store;

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
  }

  @action
  onQueryChange(query) {
    run.debounce(this, this.lookupModel, query, 500);
  }
}
