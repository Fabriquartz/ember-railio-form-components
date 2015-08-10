import Ember from 'ember';
import PropertyPathMixin from 'ember-railio-form-components/mixins/property-path-mixin';

export default Ember.TextField.extend(PropertyPathMixin, {
  propertyTarget: 'value',
  attributeBindings: ['value:title']
});
