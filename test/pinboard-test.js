// Load in dependencies
var expect = require('chai').expect;
var Pinboard = require('../');

// Define test utilities
var pinboardUtils = {
  init: function (params) {
    before(function createClient () {
      this.client = new Pinboard(params);
    });
    after(function cleanup () {
      delete this.client;
    });
  },
  execSync: function (fn) {
    before(function execSyncFn () {
      this.result = fn.call(this);
    });
    after(function cleanup () {
      delete this.result;
    });
  },
  execRequest: function (fn) {
    before(function execRequestFn (done) {
      var that = this;
      fn.call(this, function handleResponse (err, res, body) {
        that.err = err;
        that.res = res;
        that.body = body;
        done();
      });
    });
    after(function cleanup () {
      delete this.err;
      delete this.res;
      delete this.body;
    });
  }
};

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
  pinboardUtils.init({
    // test-credentials = {type, username, token}
    auth: require('./test-credentials')
  });

  describe('requesting an update page', function () {
    pinboardUtils.execRequest(function buildUrl (done) {
      this.client.postsUpdate({format: 'json'}, done);
    });

    it('receives a valid response', function () {
      // TODO: Use eight-track to force response value
      expect(this.err).to.equal(null);
      expect(this.res.statusCode).to.equal(200);
      // expect(this.body).to.equal(200);
    });
  });
});
