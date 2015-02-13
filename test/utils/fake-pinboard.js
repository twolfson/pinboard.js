// Load in depdendencies
var assert = require('assert');
var url = require('url');
var FixedServer = require('fixed-server');
var nineTrack = require('nine-track');
var xtend = require('xtend');
var config = require('./config');

// Define our FakePinboard server
var fakePinboard = new FixedServer({port: config.fakePinboardUrl.port});
var pinboardNineTrackOptions = {
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
};
var pinboardNineTrack = nineTrack(pinboardNineTrackOptions);

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

fakePinboard.addFixture('GET 200 /v1/tags/get', {
  method: 'get',
  route: '/v1/tags/get',
  response: function fakeTagsGet (localReq, localRes) {
    // Forward the request
    pinboardNineTrack.forwardRequest(localReq, function handleResponse (err, remoteRes, remoteBody) {
      // If there is an error, throw it
      if (err) {
        throw err;
      }

      // Otherwise, adjust the body
      var remoteJson = JSON.parse(remoteBody);
      if (typeof remoteJson === 'object') {
        // Add in our expected tag
        remoteJson['test-tag'] = 1;
      }

      // Send back our response
      localRes.json(remoteJson);
    });
  }
});

fakePinboard.addFixture('GET 200 /v1/user/secret', {
  method: 'get',
  route: '/v1/user/secret',
  response: nineTrack(xtend({}, pinboardNineTrackOptions, {
    scrubFn: function (info) {
      // Normalize/scrub authentication info with original fn
      pinboardNineTrackOptions.scrubFn.call(this, info);

      // If we have a response, scrub it
      if (info.response) {
        var responseJson = JSON.parse(info.response.body);
        if (responseJson.result !== undefined) {
          responseJson.result = responseJson.result.replace(/./g, 'a');
        }
        info.response.body = JSON.stringify(responseJson) + '\n\t';
      }
    }
  }))
});

// Add a method to proxy anything
fakePinboard.addFixture('ALL * *', {
  method: 'all',
  route: '*',
  response: pinboardNineTrack
});

// Add custom methods to start/stop `nine-track` series
// DEV: We keep key and fixtures together to prevent fragmentations. This should be all or nothing for a test case.
fakePinboard.runSeries = function (key, fixtures) {
  assert(key, '`fakePinboard.runSeries` requires `key` to run. Please provide it');
  assert(fixtures, '`fakePinboard.runSeries` requires `fixtures` to run. Please provide it');
  before(function startSeries () {
    pinboardNineTrack.startSeries(key);
  });
  after(function stopSeries () {
    pinboardNineTrack.stopSeries();
  });
  fakePinboard.run(fixtures);
};

// Expose our fake server
module.exports = fakePinboard;
