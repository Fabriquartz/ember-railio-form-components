import Ember from 'ember';

const get = Ember.get;

export default Ember.Helper.helper(function([object, labelPath]) {
  if (typeof labelPath === 'string') {
    return get(object, labelPath);
  }
}, 'object', 'labelPath');
