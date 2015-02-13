// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user retrieving recent posts', function () {
  fakePinboard.run(['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsRecent({format: 'json'}, done);
  });

  it('receives a posts', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)).to.have.property('posts');
  });
});
