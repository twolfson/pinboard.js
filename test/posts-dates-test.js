// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user retrieving dates of posts', function () {
  fakePinboard.run(['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsDates({
      tag: 'nothing',
      format: 'json'
    }, done);
  });

  it('receives post dates', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    // {"user":"twolfson","tag":"nothing","dates":[]}
    expect(JSON.parse(this.body)).to.have.property('tag', 'nothing');
    expect(JSON.parse(this.body)).to.have.property('dates');
  });
});
