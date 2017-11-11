/**
 * Contains tests for all the public methods of the GlobalStore class
 */

// This is the class that needs to be tested
const { GlobalStore } = require('../dist/store')
const assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
