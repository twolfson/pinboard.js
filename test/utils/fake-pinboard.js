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

// Add per-method proxies
fakePinboard.addFixture('GET 200 /v1/posts/update', {
  method: 'get',
  route: '/v1/posts/update',
  response: function fakePostsUpdate (localReq, localRes) {
    // Forward the request
    pinboardNineTrack.forwardRequest(localReq, function handleResponse (err, remoteRes, remoteBody) {
      // If there is an error, throw it
      if (err) {
        throw err;
      }

      // Otherwise, adjust the body
      var remoteJson = JSON.parse(remoteBody);
      if (remoteJson.update_time) {
        // Adjust ISO timestamp format (e.g. `2014-01-29T09:42:58Z`)
        remoteJson.update_time = remoteJson.update_time.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
          '2015-02-01T00:00:00Z');
      }

      // Send back our response
      localRes.json(remoteJson);
    });
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
