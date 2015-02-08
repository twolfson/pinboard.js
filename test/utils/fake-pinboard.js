// Load in depdendencies
var url = require('url');
var FixedServer = require('fixed-server');
var nineTrack = require('nine-track');
var config = require('./config');

// Define our FakePinboard server
var fakePinboard = new FixedServer({port: config.fakePinboardUrl.port});
var pinboardNineTrack = nineTrack({
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
});

// Add a method to proxy anything
fakePinboard.addFixture('ALL * *', {
  method: 'all',
  route: '*',
  response: pinboardNineTrack
});

// Expose our fake server
module.exports = fakePinboard;
