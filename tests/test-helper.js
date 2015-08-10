import QUnit from 'qunit';
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';

setResolver(resolver);

function inDelta(actual, expected, delta) {
  return actual >= (expected - delta) && actual <= (expected + delta);
}

QUnit.assert.inDelta = function(actual, expected, delta, message) {
  message = message || `failed, expected #{Qunit.dump.parse(actual)} to be within
            ${QUnit.dump.parse(delta)} of ${QUnit.dump.parse(expected)}`;
  return this.ok(inDelta(actual, expected, delta), message);
};
