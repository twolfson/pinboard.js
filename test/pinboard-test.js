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
    before(function execFn () {
      this.result = fn.call(this);
    });
    after(function cleanup () {
      delete this.result;
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
