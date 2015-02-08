// Load in dependencies
var expect = require('chai').expect;
var config = require('./utils/config');
var fakePinboard = require('./utils/fake-pinboard');
var pinboardUtils = require('./utils/pinboard');

// Start our tests
describe('An HTTP pinboard.js user', function () {
  pinboardUtils.init({
    auth: {
      type: 'http',
      username: 'todd',
      password: 'password'
    }
  });

  describe('building a URL', function () {
    pinboardUtils.execSync(function buildUrl () {
      return this.client.buildUrl({
        pathname: '/posts/get',
        query: {
          tag: 'hello'
        }
      });
    });

    it('receives a valid URL', function () {
      expect(this.result).to.equal('https://todd:password@api.pinboard.in/v1/posts/get?tag=hello');
    });
  });
});

describe('An API pinboard.js user', function () {
  pinboardUtils.init({
    auth: {
      type: 'token',
      username: 'todd',
      token: 'password'
    }
  });

  describe('building a URL', function () {
    pinboardUtils.execSync(function buildUrl () {
      return this.client.buildUrl({
        pathname: '/posts/get',
        query: {
          tag: 'hello'
        }
      });
    });

    it('receives a valid URL', function () {
      var expectedUrl = 'https://api.pinboard.in/v1/posts/get?auth_token=todd%3Apassword&tag=hello';
      expect(this.result).to.equal(expectedUrl);
    });
  });
});

describe('A pinboard.js user', function () {
  fakePinboard.run(['ALL * *']);
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
    });
  });
});
