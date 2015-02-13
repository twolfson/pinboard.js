// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user looking up their secret', function () {
  // DEV: Use special fixture to scrub sensitive info
  fakePinboard.run(['GET 200 /v1/user/secret']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.userSecret({
      format: 'json'
    }, done);
  });

  it('finds their secret', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)).to.deep.equal({
      result_code: 'done'
    });
  });
});
