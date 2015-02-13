// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user creating a post', function () {
  fakePinboard.runSeries('tests-get-rename-delete', ['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsAdd({
      url: 'http://notavalidwebsite.com/tags',
      description: 'Test bookmark for verifying tags on `pinboard.js`',
      tags: 'test-tag',
      format: 'json'
    }, done);
  });
  pinboardUtils._execRequest(after, function buildUrl (done) {
    this.client.postsDelete({
      url: 'http://notavalidwebsite.com/tags',
      format: 'json'
    }, done);
  });

  it('generates a post', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)).to.deep.equal({
      result_code: 'done'
    });
  });

  describe('and retrieving the tags', function () {
    pinboardUtils.execRequest(function buildUrl (done) {
      this.client.tagsGet({
        format: 'json'
      }, done);
    });

    it('receives the new tag', function () {
      expect(this.err).to.equal(null);
      expect(this.res.statusCode).to.equal(200);
      expect(JSON.parse(this.body)).to.have.property('test-tag', 1);
    });

    describe('and renaming the tag', function () {
      pinboardUtils.execRequest(function buildUrl (done) {
        this.client.tagsRename({
          old: 'test-tag',
          'new': 'test-tag2',
          format: 'json'
        }, done);
      });

      it('has no errors', function () {
        expect(this.err).to.equal(null);
        expect(this.res.statusCode).to.equal(200);
        // TODO: Make note of inconsistent `result` response key
        expect(JSON.parse(this.body)).to.deep.equal({
          result: 'done'
        });
      });

      describe('and deleting the tag', function () {
        pinboardUtils.execRequest(function buildUrl (done) {
          this.client.tagsDelete({
            tag: 'test-tag2',
            format: 'json'
          }, done);
        });

        it('has no errors', function () {
          expect(this.err).to.equal(null);
          expect(this.res.statusCode).to.equal(200);
          expect(JSON.parse(this.body)).to.deep.equal({
            result_code: 'done'
          });
        });
      });
    });
  });
});
