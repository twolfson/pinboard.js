// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('A pinboard.js user creating a post', function () {
  fakePinboard.runSeries('posts-add-get-delete', ['ALL * *']);
  pinboardUtils.init({
    auth: config.credentials,
    url: config.fakePinboardUrl
  });
  pinboardUtils.execRequest(function buildUrl (done) {
    this.client.postsAdd({
      url: 'http://notavalidwebsite.com/',
      description: 'Test bookmark for `pinboard.js`',
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

  describe('and retrieving the post', function () {
    pinboardUtils.execRequest(function buildUrl (done) {
      this.client.postsGet({
        url: 'http://notavalidwebsite.com/',
        format: 'json'
      }, done);
    });

    it('receives the original post', function () {
      expect(this.err).to.equal(null);
      expect(this.res.statusCode).to.equal(200);
      expect(JSON.parse(this.body)).to.have.property('posts');
      // {"date":"2015-02-13T06:27:59Z","user":"twolfson","posts":[{"href","description","extended",...}]}
      expect(JSON.parse(this.body).posts).to.have.length(1);
      expect(JSON.parse(this.body).posts[0]).to.have.property('href', 'http://notavalidwebsite.com/');
    });

    describe('and deleting the post', function () {
      pinboardUtils.execRequest(function buildUrl (done) {
        this.client.postsDelete({
          url: 'http://notavalidwebsite.com/',
          format: 'json'
        }, done);
      });

      it('deletes the post', function () {
        expect(this.err).to.equal(null);
        expect(this.res.statusCode).to.equal(200);
        expect(JSON.parse(this.body)).to.deep.equal({
          result_code: 'done'
        });
      });

      describe('and retrieving the deleted post', function () {
        pinboardUtils.execRequest(function buildUrl (done) {
          this.client.postsGet({
            url: 'http://notavalidwebsite.com/',
            format: 'json'
          }, done);
        });

        it('retrieves nothing', function () {
          expect(this.err).to.equal(null);
          expect(this.res.statusCode).to.equal(200);
          expect(JSON.parse(this.body)).to.have.property('posts');
          expect(JSON.parse(this.body).posts).to.have.length(0);
        });
      });
    });
  });
});
