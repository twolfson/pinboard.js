// Load in our dependencies
var xtend = require('xtend');
var url = require('url');

// Define helper for asserts
function assert(val, msg) {
  if (!val) {
    throw new Error(msg);
  }
}

/**
 * Pinboard API library constructor
 * @param params {Object} Container for our parameters
 * @param params.auth {Object} Container for authentication credentials
 * @param params.auth.type {String} Type of authentication to use. Valid types are 'http' and 'token' (default)
 * @param params.auth.username {String} Username to use during authentication
 * @param params.auth.password {String} Password to use during HTTP authentication
 * @param params.auth.token {String} Token to use during token authentication
 * @param params.url {Object} Override set of URL parameters for our URL
 */
function Pinboard(params) {
  // Verify we have either auth and a username for auth
  var auth = params.auth;
  assert(auth, '`params.auth` is required for `Pinboard` constructor but it wasn\'t provided');
  assert(auth.username, '`params.auth.username` is required for authentication. Please provide it.');

  // If we are performing HTTP authentication
  if (auth.type === 'http') {
    // Verify we have the password
    assert(auth.password, '`params.auth.password` is required for HTTP authentication. Please provide it.');

    // Set up our HTTP url
    this.url = xtend({}, params.url || Pinboard.url, {
      auth: auth.username + ':' + auth.password,
      query: {}
    });
  // Otherwise, set up token auth (default)
  } else {
    // Verify we have the token
    assert(auth.token, '`params.auth.token` is required for API authentication. Please provide it.');

    // Set up our API url
    this.url = xtend({}, params.url || Pinboard.url, {
      query: {
        auth_token: auth.username + ':' + auth.token
      }
    });
  }
}
Pinboard.request = function (params, cb) {
  var err = new Error('This should be overridden by either requiring `pinboard.js`, ' +
    '`pinboard.js/lib/node.js`, or `pinboard.js/lib/browser.js`');
  cb(err);
};

// Define a default URL
Pinboard.url = {
  protocol: 'https:',
  hostname: 'api.pinboard.in',
  pathname: '/v1'
};

// Define our prototype
Pinboard.prototype = {
  buildUrl: function (urlObj) {
    // Add on URL parameters to the requested URL
    // TODO: If Pinboard introduces POST, consider a refactor where *all* join logic occurs here, not in constructor
    // {protocol: 'https:', hostname: 'api.pinboard.in', this.pathname ('/v1') + urlObj.pathname ('/posts/get'), query}
    return url.format(xtend({}, this.url, {
      pathname: this.url.pathname + urlObj.pathname,
      query: xtend({}, this.url.query, urlObj.query)
    }));
  },
  // https://api.pinboard.in/v1/posts/update
  //   https://pinboard.in/api/#posts_update
  postsUpdate: function (options, cb) {
    var urlStr = this.buildUrl({pathname: '/posts/update', query: options});
    return Pinboard.request(urlStr, cb);
  }
};

// TODO: Define custom prototype extensions (copy/paste from google-music.js

// Export our constructor
module.exports = Pinboard;
