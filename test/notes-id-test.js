// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user looking up a specific note', function () {
  fakePinboard.run(['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.notesId({
      // DEV: This note had to be created manually
      id: '96aef597562f7a4f45d1',
      format: 'json'
    }, done);
  });

  it('finds the node', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    // {"id":"96aef597562f7a4f45d1","title","created_at","updated_at","length","text","hash"}
    expect(JSON.parse(this.body)).to.have.property('id');
    expect(JSON.parse(this.body)).to.have.property('title');
    expect(JSON.parse(this.body)).to.have.property('text');
  });
});
