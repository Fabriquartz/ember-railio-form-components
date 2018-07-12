import resolver        from './helpers/resolver';
import QUnit           from 'qunit';
import { setResolver } from 'ember-qunit';
import { start }       from 'ember-cli-qunit';

setResolver(resolver);
start();

function inDelta(actual, expected, delta) {
  return actual >= (expected - delta) && actual <= (expected + delta);
}

QUnit.assert.inDelta = function(actual, expected, delta, message) {
  message = message || `failed, expected #{Qunit.dump.parse(actual)} to be within
            ${QUnit.dump.parse(delta)} of ${QUnit.dump.parse(expected)}`;
  return this.ok(inDelta(actual, expected, delta), message);
};