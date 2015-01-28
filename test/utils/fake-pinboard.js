// Load in depdendencies
var url = require('url');
var http = require('http');
var nineTrack = require('nine-track');

// Define our nine-track server
exports.run = function () {
  var server;
  before(function runFn () {
    server = http.createServer(nineTrack({
      url: 'https://api.pinboard.in',
      fixtureDir: __dirname + '/../test-files/pinboard-nine-track/',
      // Normalize/scrub authentication info
      scrubFn: function (info) {
        // Parse our URL
        var req = info.request;
        var urlObj = url.parse(req.url, true);

        // If there is a query object and we have auth info, normalize it
        if (urlObj.query && urlObj.query.auth_token) {
          urlObj.query.auth_token = '*:*';
          delete urlObj.search;

          // Save our updated URL
          req.url = url.format(urlObj);
        }
      }
    }));
    server.listen(9001);
  });
  after(function cleanup (done) {
    server.close(function handleClose (err) {
      server = null;
      done();
    });
  });
};
