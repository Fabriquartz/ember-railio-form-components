import Helper                      from 'ember-helper';
import { proxyIsEqual as isEqual } from 'ember-proxy-util';

export default Helper.helper(function([a, b]) {
  return isEqual(a, b);
});
