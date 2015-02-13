// Load in dependencies
var Pinboard = require('../../');

// Define test utilities
exports.init = function (params) {
  before(function createClient () {
    this.client = new Pinboard(params);
  });
  after(function cleanup () {
    delete this.client;
  });
};

exports.execSync = function (fn) {
  before(function execSyncFn () {
    this.result = fn.call(this);
  });
  after(function cleanup () {
    delete this.result;
  });
};

exports._execRequest = function (fn) {
  return function execRequestFn (done) {
    var that = this;
    fn.call(this, function handleResponse (err, res, body) {
      that.err = err;
      that.res = res;
      that.body = body;
      done();
    });
  };
};

exports.execRequest = function (fn) {
  before(exports._execRequest(fn));
  after(function cleanup () {
    delete this.err;
    delete this.res;
    delete this.body;
  });
};
