// Load in dependencies
var assert = require('assert');
var pinboardJs = require('../');

// Start our tests
describe('pinboard.js', function () {
  it('returns awesome', function () {
    assert.strictEqual(pinboardJs(), 'awesome');
  });
});
