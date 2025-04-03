// src/SimpleTest.test.js

const assert = require('assert');

describe('Simple Test', function() {
  it('1 + 1 should equal 2', function() {
    assert.strictEqual(1 + 1, 2, '1 + 1 should equal 2');
  });
});