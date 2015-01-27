// Load in depdendencies
var http = require('http');
var eightTrack = require('eight-track');

// Define our eight-track server
exports.run = function () {
  var server;
  before(function runFn () {
    server = http.createServer(eightTrack({
      url: 'https://api.pinboard.in',
      fixtureDir: __dirname + '/../test-files/pinboard-eight-track/',
      normalizeFn: function (info) {
        delete info.url;
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
