// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user creating a post', function () {
  // TODO: Start eight-track series here
  fakePinboard.run(['GET 200 /v1/posts/update']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsAdd({format: 'json'}, done);
  });

  it('generates a post', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)).to.equal(200);
  });

  describe.skip('and retrieving the post', function () {
    it('receives the original post', function () {
      expect(this.err).to.equal(null);
      expect(this.res.statusCode).to.equal(200);
      expect(JSON.parse(this.body)).to.equal(200);
    });

    describe.skip('and deleting the post', function () {
      it('deletes the post', function () {
        expect(this.err).to.equal(null);
        expect(this.res.statusCode).to.equal(200);
        expect(JSON.parse(this.body)).to.equal(200);
      });

      describe.skip('and retrieving the deleted post', function () {
        it('retrieves nothing', function () {
          expect(this.err).to.equal(null);
          expect(this.res.statusCode).to.equal(200);
          expect(JSON.parse(this.body)).to.equal(200);
        });
      });
    });
  });
});
