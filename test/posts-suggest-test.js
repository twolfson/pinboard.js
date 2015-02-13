// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user retrieving post suggestions', function () {
  fakePinboard.run(['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsSuggest({
      url: 'https://pinboard.in/',
      format: 'json'
    }, done);
  });

  it('receives suggestions', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    // [{"popular":[]},{"recommended":["bookmarking","Bookmarks_bar",...]}]
    expect(JSON.parse(this.body)).to.have.length(2);
    expect(JSON.parse(this.body)[0]).to.have.property('popular');
    expect(JSON.parse(this.body)[1]).to.have.property('recommended');
  });
});
