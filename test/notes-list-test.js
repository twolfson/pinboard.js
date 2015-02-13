// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user looking up their notes', function () {
  fakePinboard.run(['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.notesList({
      format: 'json'
    }, done);
  });

  it('retrieves their notes', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    // {"count":0,"notes":[]}
    expect(JSON.parse(this.body)).to.have.property('count');
    expect(JSON.parse(this.body)).to.have.property('notes');
  });
});
