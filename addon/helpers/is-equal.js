import Ember from 'ember';

import {
  proxyIsEqual as isEqual
} from 'ember-proxy-util';

export default Ember.Helper.helper(function([a, b]) {
  return isEqual(a, b);
});
