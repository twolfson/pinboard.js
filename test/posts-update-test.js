// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user', function () {
  fakePinboard.run(['GET 200 /v1/posts/update']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });

  describe('requesting an update page', function () {
    pinboardUtils.execRequest(function buildUrl (done) {
      this.client.postsUpdate({format: 'json'}, done);
    });

    it('receives a valid response', function () {
      expect(this.err).to.equal(null);
      expect(this.res.statusCode).to.equal(200);
      // DEV: `update_time` is adjusted inside of fakePinboard
      expect(JSON.parse(this.body)).to.deep.equal({
        update_time: '2015-02-01T00:00:00Z'
      });
    });
  });
});
